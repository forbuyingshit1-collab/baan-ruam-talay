import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { getShippingInfo } from '../utils/shipping.js';
import { messengerService } from '../services/messenger.service.js';
import { googleSheetsService } from '../services/google-sheets.service.js';
import { aiService } from '../services/ai.service.js';
import { IncomingMessage, ConversationMessage, CustomerSession } from '../types/index.js';

const sessions = new Map<string, CustomerSession>();

export class MessageHandler {
  async handleMessage(message: IncomingMessage): Promise<void> {
    const { senderId, text, isPostback } = message;

    logger.info(`Received message from ${senderId}: ${text}`);

    await messengerService.sendTypingIndicator(senderId, true);

    try {
      const session = this.getOrCreateSession(senderId, message.platform);
      const intent = await aiService.detectIntent(text);

      logger.debug(`Detected intent: ${intent.intent} (confidence: ${intent.confidence})`);

      let response: string;

      switch (intent.intent) {
        case 'greeting':
          response = await this.handleGreeting(senderId, session);
          break;
        case 'location':
          response = await this.handleLocation(senderId);
          break;
        case 'wholesale':
          response = await this.handleWholesaleInquiry(senderId, text);
          break;
        case 'payment':
          response = await this.handlePaymentInquiry(senderId);
          break;
        case 'shipping':
          response = await this.handleShippingInquiry(senderId);
          break;
        default:
          response = await this.handleGeneralMessage(senderId, text, session);
      }

      this.updateConversationHistory(session, text, response);

    } catch (error) {
      logger.error('Error handling message:', error);
      await messengerService.sendText(senderId, 'ขอโทษครับ มีปัญหาบางอย่าง กรุณาลองใหม่อีกครั้งครับ');
    } finally {
      await messengerService.sendTypingIndicator(senderId, false);
    }
  }

  async handlePostback(senderId: string, payload: string): Promise<void> {
    logger.info(`Received postback from ${senderId}: ${payload}`);

    try {
      if (payload.startsWith('INTERESTED_')) {
        const productId = payload.replace('INTERESTED_', '');
        await this.handleProductInterest(senderId, productId);
      } else if (payload.startsWith('WHOLESALE_')) {
        const productId = payload.replace('WHOLESALE_', '');
        await this.handleWholesaleRequest(senderId, productId);
      } else if (payload === 'GET_STARTED') {
        const session = this.getOrCreateSession(senderId, 'messenger');
        await this.handleGreeting(senderId, session);
      }
    } catch (error) {
      logger.error('Error handling postback:', error);
      await messengerService.sendText(senderId, 'ขอโทษครับ มีปัญหาบางอย่าง กรุณาลองใหม่อีกครั้งครับ');
    }
  }

  private async handleGreeting(senderId: string, session: CustomerSession): Promise<string> {
    const products = await googleSheetsService.getCarouselProducts(6);

    if (products.length > 0) {
      const carousel = messengerService.buildProductCarousel(products);
      await messengerService.sendCarousel(senderId, carousel);
    }

    const greeting = 'สวัสดีครับ ยินดีต้อนรับสู่ร้านบ้านรวมทะเล 🦐 เลือกสินค้าที่สนใจได้เลยครับ';
    await messengerService.sendText(senderId, greeting);

    return greeting;
  }

  private async handleLocation(senderId: string): Promise<string> {
    const response = `📍 พิกัดร้านบ้านรวมทะเลครับ\n${config.business.storeMapUrl}\n\nยินดีต้อนรับครับ`;
    await messengerService.sendText(senderId, response);
    return response;
  }

  private async handleWholesaleInquiry(senderId: string, text: string): Promise<string> {
    const { wholesaleMinimum } = config.business;

    const response = `📦 เงื่อนไขราคาส่งครับ:
• อาหารทะเล: สั่งขั้นต่ำ ${wholesaleMinimum.seafood} กก.
• หมูแปรรูป: สั่งขั้นต่ำ ${wholesaleMinimum.pork} กก.

บอกชื่อสินค้าที่สนใจ จะแจ้งราคาส่งให้ครับ`;

    await messengerService.sendText(senderId, response);
    return response;
  }

  private async handlePaymentInquiry(senderId: string): Promise<string> {
    const response = `💳 ช่องทางชำระเงินครับ:
• โอนเงิน: สแกน QR Code ด้านล่าง
• ปลายทาง (COD): มีบริการครับ`;

    await messengerService.sendText(senderId, response);
    await messengerService.sendImage(senderId, config.business.paymentQrUrl);

    return response;
  }

  private async handleShippingInquiry(senderId: string): Promise<string> {
    const { canShipToday, shippingMessage } = getShippingInfo();

    const response = `🚚 ข้อมูลการจัดส่งครับ:
• ขนส่ง: ${config.business.shippingCarrier}
• ตัดรอบ: ${config.business.shippingCutoffHour}.00 น.
• ${shippingMessage}`;

    await messengerService.sendText(senderId, response);
    return response;
  }

  private async handleProductInterest(senderId: string, productId: string): Promise<void> {
    const product = await googleSheetsService.getProductById(productId);

    if (!product) {
      await messengerService.sendText(senderId, 'ขอโทษครับ ไม่พบสินค้าที่เลือก');
      return;
    }

    const { shippingMessage } = getShippingInfo();

    const response = `✅ ${product.name}
💰 ราคา: ${product.priceRetail} บาท/${product.unit}

${shippingMessage}

สนใจสั่งกี่ ${product.unit} ครับ?`;

    await messengerService.sendText(senderId, response);
  }

  private async handleWholesaleRequest(senderId: string, productId: string): Promise<void> {
    const product = await googleSheetsService.getProductById(productId);

    if (!product) {
      await messengerService.sendText(senderId, 'ขอโทษครับ ไม่พบสินค้าที่เลือก');
      return;
    }

    const minOrder = product.category === 'pork'
      ? config.business.wholesaleMinimum.pork
      : config.business.wholesaleMinimum.seafood;

    const response = product.priceWholesale
      ? `📦 ${product.name} (ราคาส่ง)
💰 ราคาส่ง: ${product.priceWholesale} บาท/${product.unit}
📋 ขั้นต่ำ: ${minOrder} ${product.unit}

สนใจสั่งเลยไหมครับ?`
      : `📦 ${product.name}
สินค้านี้ยังไม่มีราคาส่งครับ แต่ถ้าสั่งเยอะสามารถต่อรองได้ครับ

สนใจสั่งกี่ ${product.unit} ครับ?`;

    await messengerService.sendText(senderId, response);
  }

  private async handleGeneralMessage(senderId: string, text: string, session: CustomerSession): Promise<string> {
    const products = await googleSheetsService.getProducts();
    const response = await aiService.generateResponse(text, session.conversationHistory, products);

    await messengerService.sendText(senderId, response);
    return response;
  }

  private getOrCreateSession(senderId: string, platform: 'messenger' | 'line'): CustomerSession {
    let session = sessions.get(senderId);

    if (!session) {
      session = {
        id: `session-${Date.now()}`,
        psid: senderId,
        platform,
        cart: [],
        conversationHistory: [],
        lastInteraction: new Date(),
      };
      sessions.set(senderId, session);
    }

    session.lastInteraction = new Date();
    return session;
  }

  private updateConversationHistory(session: CustomerSession, userMessage: string, assistantResponse: string): void {
    const now = new Date();

    session.conversationHistory.push(
      { role: 'user', content: userMessage, timestamp: now },
      { role: 'assistant', content: assistantResponse, timestamp: now }
    );

    if (session.conversationHistory.length > 20) {
      session.conversationHistory = session.conversationHistory.slice(-20);
    }
  }
}

export const messageHandler = new MessageHandler();
