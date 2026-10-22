# 🦐 Baan Ruam Talay Bot

Chatbot สำหรับร้านอาหารทะเลแห้ง "บ้านรวมทะเล" รองรับ Facebook Messenger

## ✨ Features

- **🛒 Product Carousel**: แสดงสินค้า 6 รายการเมื่อทักทาย
- **📍 Location**: ส่งพิกัดร้านเมื่อถาม
- **💰 Pricing**: ราคาปลีกและราคาส่ง (ถามจึงบอก)
- **🚚 Shipping**: ตัดรอบ 14.00 น. (Flash Express)
- **💳 Payment**: โอนเงิน (QR) / ปลายทาง (COD)
- **📝 Order Summary**: สรุปยอดตาม Format ที่กำหนด
- **🤖 AI Response**: ใช้ OpenAI สำหรับคำถามทั่วไป

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **AI**: OpenAI GPT-4o-mini
- **Data**: Google Sheets
- **Validation**: Zod
- **Logging**: Winston

## 📁 Project Structure

```
baan-ruam-talay-bot/
├── src/
│   ├── config/          # Configuration & Environment
│   ├── handlers/        # Message Handlers
│   ├── routes/          # API Routes
│   ├── services/        # Business Logic Services
│   │   ├── ai.service.ts
│   │   ├── google-sheets.service.ts
│   │   └── messenger.service.ts
│   ├── types/           # TypeScript Types
│   ├── utils/           # Utilities
│   └── index.ts         # Entry Point
├── .env.example         # Environment Template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd baan-ruam-talay-bot
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# แก้ไข .env ตามค่าที่ต้องการ
```

### 3. Run Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## ⚙️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook Page Access Token | ✅ |
| `FACEBOOK_VERIFY_TOKEN` | Webhook Verify Token | ✅ |
| `GOOGLE_SHEET_ID` | Google Sheet Document ID | ✅ |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Service Account | ✅ |
| `GOOGLE_PRIVATE_KEY` | Google Private Key | ✅ |
| `OPENAI_API_KEY` | OpenAI API Key | ⬜ |
| `STORE_MAP_URL` | Google Maps URL | ✅ |
| `PAYMENT_QR_URL` | QR Code Payment Image | ✅ |

## 📊 Google Sheets Format

Sheet ชื่อ `Product` ต้องมี columns:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| ID | Name | Category | Price | WholesalePrice | Unit | ImageURL | Description | InStock |

## 🔗 Webhook Setup

1. ตั้ง Webhook URL: `https://your-domain.com/webhook`
2. ตั้ง Verify Token: ค่าเดียวกับ `FACEBOOK_VERIFY_TOKEN`
3. Subscribe events: `messages`, `messaging_postbacks`

## 📋 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/webhook` | Facebook Verification |
| POST | `/webhook` | Receive Messages |
| GET | `/health` | Health Check |

## 🎯 Business Rules

### ราคาส่ง (Hidden Rule)
- ห้ามบอกราคาส่งก่อนลูกค้าถาม
- อาหารทะเล: ขั้นต่ำ 10 กก.
- หมูแปรรูป: ขั้นต่ำ 5 กก.

### การจัดส่ง
- ตัดรอบ 14.00 น. (Bangkok Time)
- ก่อน 14.00 → ส่งวันนี้
- หลัง 14.00 → ส่งพรุ่งนี้

### Order Summary Format
```
[ชื่อลูกค้า]
[เบอร์โทรศัพท์]
[ที่อยู่ และ รหัสไปรษณีย์]
--------------------------------------------------
📦 รายการสั่งซื้อ:
1. [ชื่อสินค้า] ([จำนวน])
--------------------------------------------------
💰 ยอดชำระ: [ราคา] บาท (โอน / ปลายทาง)

ข้อมูลถูกต้องนะครับ? [ข้อความแจ้งรอบส่ง]
ขอบคุณมากครับ 🙏
```

## 📄 License

MIT License
