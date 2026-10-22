import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { CarouselCard, Product } from '../types/index.js';

interface MessengerApiResponse {
  recipient_id: string;
  message_id: string;
}

export class MessengerService {
  private readonly baseUrl = config.facebook.graphApiUrl;
  private readonly accessToken = config.facebook.pageAccessToken;

  async sendText(recipientId: string, text: string): Promise<void> {
    await this.callSendApi(recipientId, { text });
  }

  async sendImage(recipientId: string, imageUrl: string): Promise<void> {
    await this.callSendApi(recipientId, {
      attachment: {
        type: 'image',
        payload: { url: imageUrl, is_reusable: true },
      },
    });
  }

  async sendCarousel(recipientId: string, cards: CarouselCard[]): Promise<void> {
    const elements = cards.map((card) => ({
      title: card.title,
      subtitle: card.subtitle,
      image_url: card.imageUrl,
      buttons: card.buttons.map((btn) => ({
        type: btn.type,
        title: btn.title,
        ...(btn.type === 'postback' ? { payload: btn.payload } : { url: btn.url }),
      })),
    }));

    await this.callSendApi(recipientId, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements,
        },
      },
    });
  }

  async sendQuickReplies(recipientId: string, text: string, replies: string[]): Promise<void> {
    await this.callSendApi(recipientId, {
      text,
      quick_replies: replies.map((reply) => ({
        content_type: 'text',
        title: reply,
        payload: reply,
      })),
    });
  }

  async sendTypingIndicator(recipientId: string, isTyping: boolean): Promise<void> {
    const url = `${this.baseUrl}/me/messages?access_token=${this.accessToken}`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          sender_action: isTyping ? 'typing_on' : 'typing_off',
        }),
      });
    } catch (error) {
      logger.warn('Failed to send typing indicator:', error);
    }
  }

  buildProductCarousel(products: Product[]): CarouselCard[] {
    return products.slice(0, 10).map((product) => ({
      title: product.name,
      subtitle: `฿${product.priceRetail}/${product.unit}`,
      imageUrl: product.imageUrl,
      buttons: [
        {
          type: 'postback' as const,
          title: `สนใจ ${product.name}`,
          payload: `INTERESTED_${product.id}`,
        },
        {
          type: 'postback' as const,
          title: 'ดูราคาส่ง',
          payload: `WHOLESALE_${product.id}`,
        },
      ],
    }));
  }

  private async callSendApi(recipientId: string, message: Record<string, unknown>): Promise<MessengerApiResponse> {
    const url = `${this.baseUrl}/me/messages?access_token=${this.accessToken}`;

    const body = {
      recipient: { id: recipientId },
      messaging_type: 'RESPONSE',
      message,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('Messenger API error:', error);
        throw new Error(`Messenger API error: ${JSON.stringify(error)}`);
      }

      return (await response.json()) as MessengerApiResponse;
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw error;
    }
  }
}

export const messengerService = new MessengerService();
