import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { Product, ConversationMessage } from '../types/index.js';
import { getShippingInfo } from '../utils/shipping.js';

const SYSTEM_PROMPT = `คุณคือ "แอดมินบ้านรวมทะเล" ผู้ชายสุภาพ เป็นมิตร เชี่ยวชาญอาหารทะเลแห้ง

🚨 กฎสำคัญที่ต้องปฏิบัติ:
✅ ภาษาไทยเท่านั้น
✅ ลงท้ายทุกประโยคด้วย "ครับ"
✅ ตอบสั้น กระชับ ช่วยปิดการขายไว
✅ ห้ามบอกราคาส่ง/ราคายกลัง ถ้าลูกค้าไม่ถามโดยตรง

📦 ขั้นต่ำราคาส่ง:
- อาหารทะเล: 10 กก. ขึ้นไป
- หมูแปรรูป: 5 กก. ขึ้นไป

💳 การชำระเงิน:
- โอนเงิน: มี QR Code ให้
- ปลายทาง (COD): มีบริการ

🚚 การจัดส่ง:
- ตัดรอบ 14.00 น.
- ก่อน 14.00 = ส่งวันนี้
- หลัง 14.00 = ส่งพรุ่งนี้
- ขนส่ง: Flash Express

📋 เมื่อลูกค้าแจ้งที่อยู่ครบ ให้ตอบด้วย Format นี้เท่านั้น:

[ชื่อลูกค้า]
[เบอร์โทรศัพท์]
[ที่อยู่ และ รหัสไปรษณีย์]
--------------------------------------------------
📦 รายการสั่งซื้อ:
1. [ชื่อสินค้า] ([จำนวน])
--------------------------------------------------
💰 ยอดชำระ: [ราคา] บาท (โอน / ปลายทาง)

ข้อมูลถูกต้องนะครับ? [ข้อความแจ้งรอบส่ง]
ขอบคุณมากครับ 🙏`;

export class AiService {
  private openai: OpenAI | null = null;

  constructor() {
    if (config.ai.openaiApiKey) {
      this.openai = new OpenAI({ apiKey: config.ai.openaiApiKey });
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[],
    products: Product[]
  ): Promise<string> {
    if (!this.openai) {
      logger.warn('OpenAI not configured, using fallback response');
      return this.getFallbackResponse(userMessage);
    }

    try {
      const shippingInfo = getShippingInfo();
      const productContext = this.buildProductContext(products);

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `ข้อมูลสินค้าปัจจุบัน:\n${productContext}` },
        { role: 'system', content: `สถานะการจัดส่ง: ${shippingInfo.shippingMessage}` },
        ...conversationHistory.slice(-10).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content ?? 'ขอโทษครับ มีปัญหาในการตอบกลับ';
    } catch (error) {
      logger.error('AI generation error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  async detectIntent(message: string): Promise<{
    intent: 'greeting' | 'location' | 'product' | 'price' | 'wholesale' | 'payment' | 'shipping' | 'order' | 'unknown';
    confidence: number;
  }> {
    const lowerMessage = message.toLowerCase();

    const intentPatterns: Record<string, RegExp[]> = {
      greeting: [/^(สวัสดี|หวัดดี|ดี|hi|hello|เฮ้)/i, /^(ทักทาย|get_started)/i],
      location: [/ร้านอยู่|ที่ไหน|พิกัด|location|map|หน้าร้าน|ไปร้าน/i],
      wholesale: [/ราคาส่ง|ยกลัง|ซื้อเยอะ|ขายส่ง|ราคาโหล/i],
      payment: [/จ่าย|โอน|ชำระ|qr|เงิน|บัญชี|ปลายทาง|cod/i],
      shipping: [/ส่ง|จัดส่ง|ตัดรอบ|flash|delivery|ถึงเมื่อไหร่/i],
      order: [/สั่ง|ออเดอร์|order|ซื้อ/i],
      product: [/หมึก|กุ้ง|ปลา|ปู|หอย|หมู|สินค้า|ราคา|กิโล|kg/i],
      price: [/ราคา|เท่าไหร่|กี่บาท|ถูก|แพง/i],
    };

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return { intent: intent as 'greeting' | 'location' | 'product' | 'price' | 'wholesale' | 'payment' | 'shipping' | 'order' | 'unknown', confidence: 0.9 };
        }
      }
    }

    return { intent: 'unknown', confidence: 0.5 };
  }

  private buildProductContext(products: Product[]): string {
    if (products.length === 0) return 'ไม่มีข้อมูลสินค้า';

    return products
      .map((p) => `- ${p.name}: ฿${p.priceRetail}/${p.unit}${p.priceWholesale ? ` (ส่ง: ฿${p.priceWholesale})` : ''}`)
      .join('\n');
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (/สวัสดี|ทักทาย|hi|hello/.test(lowerMessage)) {
      return 'สวัสดีครับ ยินดีต้อนรับสู่ร้านบ้านรวมทะเล มีอะไรให้ช่วยครับ?';
    }

    if (/ราคา|เท่าไหร่/.test(lowerMessage)) {
      return 'รบกวนบอกชื่อสินค้าที่สนใจด้วยนะครับ จะได้แจ้งราคาให้ครับ';
    }

    return 'รับทราบครับ มีอะไรให้ช่วยเพิ่มเติมไหมครับ?';
  }
}

export const aiService = new AiService();
