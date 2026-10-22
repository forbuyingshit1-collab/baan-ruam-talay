import { Component, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  ArrowRight,
  Bot,
  Cable,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Instagram,
  LayoutTemplate,
  LineChart,
  MessageCircleMore,
  MessagesSquare,
  Send,
  Sparkles,
  Store,
  TableProperties,
  Workflow,
} from 'lucide-react'

import workflowShowcase from '../n8n show work flow.webp'
import messengerLogo from '../Logo/Facebook_Messenger_logo.png'
import instagramLogo from '../Logo/Instagram_logo_2016.svg.png'
import googleSheetsLogo from '../Logo/Google sheet Logo.png'
import lineLogo from '../Logo/LINE_logo.svg.png'
import n8nLogo from '../Logo/n8n Logo.png'
import telegramLogo from '../Logo/telegram logo.webp'
import productMockup1 from '../Mock-up Product/product-mockup.jpg'
import productMockup2 from '../Mock-up Product/product-mockup (2).jpg'
import productMockup3 from '../Mock-up Product/product-mockup (3).jpg'
import productMockup4 from '../Mock-up Product/product-mockup (4).jpg'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#020617', color: '#f87171', minHeight: '100vh', padding: '2rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Runtime Error</h1>
          <p style={{ fontWeight: 'bold' }}>{String(this.state.error)}</p>
          <pre style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.8rem', overflow: 'auto' }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const featureCards = [
  {
    title: 'Google Sheets Integration',
    description:
      'Use a familiar spreadsheet as the product, FAQ, and pricing source so non-technical teams can update the bot without touching code.',
    icon: Database,
    logo: googleSheetsLogo,
    stat: 'Live sync ready',
  },
  {
    title: 'Catalog Carousel',
    description:
      'Create swipeable product cards with postback actions to mirror a Messenger commerce experience and guide customers to the next step.',
    icon: LayoutTemplate,
    stat: 'Carousel + postback',
  },
  {
    title: 'AI Sales Agent',
    description:
      'Route intents for price, image, FAQ, and escalation while keeping the final response structured for automation downstream.',
    icon: Bot,
    stat: 'Price / FAQ / image / alert',
  },
  {
    title: 'Multi-Platform Delivery',
    description:
      'One workflow concept can be adapted for Facebook, Instagram, Telegram, and Line with platform-specific message formats.',
    icon: Cable,
    logo: n8nLogo,
    stat: '4 channels in one showcase',
  },
]

const workflowSteps = [
  {
    title: 'Incoming message event',
    body: 'A webhook receives a customer message or postback event from the channel.',
    icon: MessageCircleMore,
  },
  {
    title: 'Intent routing in n8n',
    body: 'The workflow classifies whether the user is asking for a price, image, FAQ, QR code, or needs admin escalation.',
    icon: Workflow,
  },
  {
    title: 'Data lookup',
    body: 'Product data and FAQ answers are pulled from a Google Sheets-style source of truth.',
    icon: TableProperties,
  },
  {
    title: 'Reply formatter',
    body: 'The bot turns the result into a text reply, image reply, QR reply, or carousel payload for the selected platform.',
    icon: Send,
  },
]

const platformCards = [
  {
    name: 'Facebook Messenger',
    detail: 'Supports webhook intake, postback buttons, catalog carousel, and image template flows.',
    color: 'from-blue-500/20 to-cyan-400/10',
    icon: MessagesSquare,
    logo: messengerLogo,
  },
  {
    name: 'Instagram DM',
    detail: 'Reuses the same automation concepts for commerce-style direct message support and quick replies.',
    color: 'from-pink-500/20 to-orange-400/10',
    icon: Instagram,
    logo: instagramLogo,
  },
  {
    name: 'Telegram',
    detail: 'Ideal for internal alerts, bot testing, and ops notifications when a live admin should take over.',
    color: 'from-sky-500/20 to-blue-300/10',
    icon: Send,
    logo: telegramLogo,
  },
  {
    name: 'Line',
    detail: 'Useful for regional commerce workflows where rich menu and direct chat experiences matter.',
    color: 'from-emerald-500/20 to-green-300/10',
    icon: LineChart,
    logo: lineLogo,
  },
]

const products = [
  {
    id: 'p1',
    name: 'Product A',
    image: productMockup1,
    description: 'Hero product for the carousel demo with a one-tap interest action.',
    halfKgPrice: 249,
    oneKgPrice: 459,
    badge: 'Popular',
  },
  {
    id: 'p2',
    name: 'Product B',
    image: productMockup2,
    description: 'Second product card that demonstrates a structured pricing reply.',
    halfKgPrice: 279,
    oneKgPrice: 499,
    badge: 'New drop',
  },
  {
    id: 'p3',
    name: 'Product C',
    image: productMockup3,
    description: 'Example image request target for image message simulation.',
    halfKgPrice: 199,
    oneKgPrice: 369,
    badge: 'Fast mover',
  },
  {
    id: 'p4',
    name: 'Product D',
    image: productMockup4,
    description: 'Used to show how a catalog can span multiple cards and postbacks.',
    halfKgPrice: 299,
    oneKgPrice: 549,
    badge: 'Bundle ready',
  },
]

const initialSheetRows = [
  {
    id: 'row-1',
    product: 'Product A',
    halfKgPrice: 249,
    oneKgPrice: 459,
    faqKey: 'shipping',
  },
  {
    id: 'row-2',
    product: 'Product B',
    halfKgPrice: 279,
    oneKgPrice: 499,
    faqKey: 'cod',
  },
  {
    id: 'row-3',
    product: 'Product C',
    halfKgPrice: 199,
    oneKgPrice: 369,
    faqKey: 'delivery-time',
  },
]

const faqAnswers = {
  shipping: 'We pack daily and dispatch every day before 1 PM for ready-to-send orders.',
  cod: 'Cash on delivery is supported in this mock flow with no extra fee added.',
  'delivery-time': 'Most destinations receive the parcel within 1-2 business days after dispatch.',
}

const channelBadges = [
  { label: 'Facebook', logo: messengerLogo },
  { label: 'Instagram', logo: instagramLogo },
  { label: 'Telegram', logo: telegramLogo },
  { label: 'Line', logo: lineLogo },
]

const chatPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    shortName: 'Messenger',
    headerBg: 'bg-gradient-to-r from-blue-600 to-blue-500',
    headerText: 'text-white',
    userBubble: 'bg-blue-500 text-white rounded-[1.25rem] rounded-br-sm',
    botBubble: 'bg-slate-200 text-slate-900 rounded-[1.25rem] rounded-bl-sm',
    botLabel: 'text-blue-600',
    typingDot: 'bg-blue-400',
    wrapperBorder: 'border-blue-500/30',
    wrapperBg: 'bg-white',
    chatBg: 'bg-gradient-to-b from-slate-50 to-white',
    statusColor: 'text-blue-500',
    avatar: '💬',
    avatarSrc: messengerLogo,
  },
  {
    id: 'instagram',
    name: 'Instagram DM',
    shortName: 'Instagram',
    headerBg: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400',
    headerText: 'text-white',
    userBubble: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-[1.25rem] rounded-br-sm',
    botBubble: 'bg-slate-200 text-slate-900 rounded-[1.25rem] rounded-bl-sm',
    botLabel: 'text-pink-600',
    typingDot: 'bg-pink-400',
    wrapperBorder: 'border-pink-500/30',
    wrapperBg: 'bg-white',
    chatBg: 'bg-gradient-to-b from-slate-50 to-white',
    statusColor: 'text-pink-500',
    avatar: '📸',
    avatarSrc: instagramLogo,
  },
  {
    id: 'line',
    name: 'Line',
    shortName: 'Line',
    headerBg: 'bg-[#06C755]',
    headerText: 'text-white',
    userBubble: 'bg-[#06C755] text-white rounded-[1.25rem] rounded-br-sm',
    botBubble: 'bg-white text-slate-900 rounded-[1.25rem] rounded-bl-sm border border-slate-200',
    botLabel: 'text-[#06C755]',
    typingDot: 'bg-emerald-400',
    wrapperBorder: 'border-emerald-500/30',
    wrapperBg: 'bg-[#F8FFF7]',
    chatBg: 'bg-[#7AADBA]/10',
    statusColor: 'text-emerald-500',
    avatar: '💚',
    avatarSrc: lineLogo,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    shortName: 'Telegram',
    headerBg: 'bg-gradient-to-r from-sky-500 to-blue-400',
    headerText: 'text-white',
    userBubble: 'bg-[#EFFDDE] text-slate-900 rounded-[1.25rem] rounded-br-sm',
    botBubble: 'bg-white text-slate-900 rounded-[1.25rem] rounded-bl-sm border border-slate-200',
    botLabel: 'text-sky-600',
    typingDot: 'bg-sky-400',
    wrapperBorder: 'border-sky-500/30',
    wrapperBg: 'bg-[#D3E9F5]/20',
    chatBg: 'bg-[#C8E1EE]/20',
    statusColor: 'text-sky-500',
    avatar: '✈️',
    avatarSrc: telegramLogo,
  },
]

const translations = {
  en: {
    nav: {
      demoTag: 'Real use-case demo',
      brand: 'AI Commerce Chatbot',
      features: 'Why AI',
      flow: 'How it works',
      demo: 'Live demo',
      platforms: 'Platforms',
    },
    hero: {
      badge: 'Proven AI chatbot — already deployed in real stores',
      title: 'Replace your admin with an AI that sells 24/7 — for under ฿2,000/month.',
      description:
        'Stop losing sales to slow replies. Our AI chatbot handles pricing, FAQs, product images, and order escalation automatically — powered by n8n, 10× cheaper than alternatives, and fully customizable to your store.',
      primaryCta: 'See live use cases',
      secondaryCta: 'How it works',
      summaryEyebrow: 'Why stores switch to AI',
      summaryTitle: 'Real results, not just a demo',
      demoMode: 'Live demo',
      liveSheetSnippet: 'Sheet-driven pricing — update anytime',
      sanitizeTag: 'Based on real deployment data',
      languageEn: 'EN',
      languageTh: 'ไทย',
    },
    sections: {
      features: {
        eyebrow: 'Why switch to AI',
        title: 'Cut costs, reply instantly, and never miss a sale again',
        description:
          'Our AI chatbot replaces the need for a dedicated admin — it answers pricing questions, sends product images, handles FAQs, and escalates orders to you only when needed. All for under ฿2,000/month.',
      },
      architecture: {
        eyebrow: 'How it works',
        title: 'From customer message to AI reply in seconds',
        description:
          'Powered by n8n — a backend automation platform that costs 10× less than alternatives like OpenClaw. Your product data lives in Google Sheets so you can update prices and FAQs without touching any code.',
        visualTitle: 'Actual workflow from the deployed n8n backend',
        visualBody: 'This is the real automation map that routes incoming messages, checks Sheets, formats replies, and alerts a human admin only when needed.',
        stepLabel: 'Step',
      },
      carousel: {
        eyebrow: 'Product catalog',
        title: 'Your products, beautifully presented inside the chat',
        description:
          'Customers browse a swipeable product carousel right inside Messenger — tap to ask price, see details, or place an order. No app download needed.',
        cardCounter: 'Card',
        of: 'of',
        carouselTitle: 'Swipeable catalog mock',
        halfKg: '0.5 kg',
        oneKg: '1 kg',
        button: 'Simulate postback: I am interested',
      },
      sheet: {
        eyebrow: 'Easy management',
        title: 'Update prices in Google Sheets — the bot answers instantly',
        description:
          'No coding required. Change a price or FAQ answer in your spreadsheet and the chatbot uses the new data immediately. Your team stays in control.',
        columns: {
          product: 'Product',
          halfKg: '0.5 kg',
          oneKg: '1 kg',
        },
        tip: 'Try it: edit a price above, then ask the bot for that product\'s price in the demo chat.',
      },
      demo: {
        eyebrow: 'Try it yourself',
        title: 'One AI brain, every chat platform your customers use',
        description:
          'The same bot logic works on Facebook Messenger, Instagram DM, Line, and Telegram. Switch platforms below and test real scenarios.',
        scenariosEyebrow: 'Pick a scenario',
        scenariosDescription: 'Tap a button to see how the AI responds in {platform}.',
        mockDataTitle: 'Real patterns',
        mockDataBody: 'Based on actual store deployments.',
        scriptedTitle: 'Full coverage',
        scriptedBody: 'Pricing, FAQ, images, QR payments & admin handoff.',
        workflowTitle: 'One workflow',
        workflowBody: 'Built once on n8n, runs on all 4 platforms.',
        demoConversation: 'Demo conversation',
        interactive: 'Interactive',
        interested: 'Interested',
        alert: 'Escalation flow: notify a live admin in Telegram or Line.',
      },
      platforms: {
        eyebrow: 'Multi-platform ready',
        title: 'Reach your customers wherever they chat',
        description: 'Deploy once, sell everywhere. The same AI powers Facebook, Instagram, Telegram, and Line — no extra setup per channel.',
      },
    },
    featureCards: [
      {
        title: 'Slash admin costs',
        description: 'No need for a full-time chat admin. The AI handles 90%+ of customer inquiries automatically — all for under ฿2,000/month.',
        stat: 'Under ฿2k/mo',
      },
      {
        title: 'Fully customizable',
        description: 'Every reply, product card, and FAQ answer is tailored to your store. Update your Google Sheet and the bot adapts instantly.',
        stat: 'Your store, your rules',
      },
      {
        title: 'Proven in production',
        description: 'Already deployed in real stores with real customers. This is not a prototype — it is a working solution you can adopt today.',
        stat: 'Real use cases',
      },
      {
        title: '4 platforms, 1 setup',
        description: 'Facebook, Instagram, Telegram, and Line — all powered by a single n8n workflow that costs 10× less than OpenClaw.',
        stat: 'n8n-powered',
      },
    ],
    workflowSteps: [
      {
        title: 'Customer sends a message',
        body: 'A shopper asks about price, product details, shipping, or wants to place an order via chat.',
      },
      {
        title: 'AI understands the intent',
        body: 'n8n routes the message — is it a price check, FAQ, image request, QR payment, or something that needs a human?',
      },
      {
        title: 'Fetches your latest data',
        body: 'Product prices and FAQ answers are pulled live from your Google Sheet — always up to date, zero coding.',
      },
      {
        title: 'Sends the perfect reply',
        body: 'The AI responds with text, product images, a carousel, QR code, or hands off to a real admin — all in seconds.',
      },
    ],
    platformDetails: [
      'Full commerce flow: product carousel, postback buttons, image replies, and QR payment — all inside Messenger.',
      'Sell through DMs with the same AI. Quick replies and product cards work seamlessly in Instagram.',
      'Get instant alerts when a customer needs human help. Your admin team stays in the loop via Telegram.',
      'Perfect for Thai commerce. Rich menu integration and direct chat support where your customers already are.',
    ],
    productNames: { p1: 'Product A', p2: 'Product B', p3: 'Product C', p4: 'Product D' },
    productDescriptions: {
      p1: 'Hero product for the carousel demo with a one-tap interest action.',
      p2: 'Second product card that demonstrates a structured pricing reply.',
      p3: 'Example image request target for image message simulation.',
      p4: 'Used to show how a catalog can span multiple cards and postbacks.',
    },
    badges: { p1: 'Popular', p2: 'New drop', p3: 'Fast mover', p4: 'Bundle ready' },
    quickActions: {
      catalog: { label: 'Show catalog carousel', userText: 'Show me the full catalog' },
      'price-a': { label: 'Ask Product A price', userText: 'How much is Product A?' },
      'price-b': { label: 'Ask Product B price', userText: 'How much is Product B?' },
      'faq-shipping': { label: 'Ask shipping FAQ', userText: 'Can you ship today?' },
      'faq-delivery': { label: 'Ask delivery time', userText: 'How long does delivery take?' },
      'image-b': { label: 'Request product image', userText: 'Can I see Product B?' },
      qr: { label: 'Request QR', userText: 'Please send the QR code' },
      order: { label: 'Try order escalation', userText: 'I want to place an order' },
    },
    sheetScenarios: {
      source: {
        title: 'Google Sheets as source of truth',
        body: 'Edit the mock table below and the generated price response updates immediately.',
      },
      unified: {
        title: 'Product + FAQ in one model',
        body: 'A single table-based operating model can power price replies, FAQ answers, and catalog buttons.',
      },
    },
    botLabels: {
      intro: 'AI Commerce Bot',
      carousel: 'Carousel',
      sheets: 'Google Sheets',
      faq: 'FAQ',
      image: 'Product Image',
      qr: 'QR Flow',
      alert: 'Admin Alert',
      agent: 'AI Agent',
    },
    botIntro: 'This is a live demo of an AI chatbot already running in real stores. Pick a scenario to see how it handles real customer questions.',
    faqAnswers: {
      shipping: 'We pack daily and dispatch every day before 1 PM for ready-to-send orders.',
      cod: 'Cash on delivery is supported in this mock flow with no extra fee added.',
      'delivery-time': 'Most destinations receive the parcel within 1-2 business days after dispatch.',
    },
    botReplies: {
      catalog: 'Here are your products — customers can browse and tap to ask about any item.',
      priceSuffixA: 'This price was pulled live from Google Sheets. Update the sheet and the bot replies with the new price instantly.',
      priceSuffixB: 'Same pricing engine works across all 4 platforms — update once, answer everywhere.',
      imageB: 'Product image sent instantly — no admin needed.',
      qr: 'QR payment link generated automatically for checkout-ready customers.',
      order: 'This is where a human takes over — the bot notifies your admin via Telegram or Line to close the sale.',
      fallback: 'The AI is ready to help.',
    },
  },
  th: {
    nav: {
      demoTag: 'เดโมผลงานจริง',
      brand: 'AI Commerce Chatbot',
      features: 'ทำไมต้อง AI',
      flow: 'ระบบทำงาน',
      demo: 'ลองเล่น',
      platforms: 'แพลตฟอร์ม',
    },
    hero: {
      badge: 'AI Chatbot ที่ใช้งานจริงแล้วในร้านค้าออนไลน์',
      title: 'เปลี่ยนแอดมินตอบแชทเป็น AI — ขายได้ 24 ชั่วโมง ไม่ถึง ฿2,000/เดือน',
      description:
        'หยุดเสียยอดขายจากการตอบช้า AI Chatbot ของเราตอบราคา FAQ รูปสินค้า และส่งต่อแอดมินอัตโนมัติ — รันบน n8n ที่ถูกกว่า OpenClaw 10 เท่า ปรับแต่งได้ตามร้านคุณ',
      primaryCta: 'ดูผลงานจริง',
      secondaryCta: 'ระบบทำงานยังไง',
      summaryEyebrow: 'ทำไมร้านค้าถึงเปลี่ยนมาใช้ AI',
      summaryTitle: 'ผลลัพธ์จริง ไม่ใช่แค่เดโม',
      demoMode: 'เดโมสด',
      liveSheetSnippet: 'ราคาดึงจากชีต — แก้เมื่อไหร่ก็ได้',
      sanitizeTag: 'อ้างอิงจากระบบที่ใช้งานจริง',
      languageEn: 'EN',
      languageTh: 'ไทย',
    },
    sections: {
      features: {
        eyebrow: 'ทำไมต้องเปลี่ยนมาใช้ AI',
        title: 'ลดต้นทุน ตอบไว ไม่พลาดยอดขายอีกต่อไป',
        description:
          'AI Chatbot ของเราทำหน้าที่แทนแอดมินตอบแชท — ตอบราคา ส่งรูปสินค้า ตอบ FAQ และส่งต่อคนจริงเมื่อต้องการ ทั้งหมดไม่ถึง ฿2,000/เดือน',
      },
      architecture: {
        eyebrow: 'ระบบทำงานยังไง',
        title: 'จากข้อความลูกค้า สู่คำตอบ AI ในไม่กี่วินาที',
        description:
          'รันบน n8n — ระบบ automation ที่ต้นทุนถูกกว่า OpenClaw ถึง 10 เท่า ข้อมูลสินค้าอยู่ใน Google Sheets แก้ราคาหรือ FAQ ได้เองโดยไม่ต้องเขียนโค้ด',
        visualTitle: 'ภาพ workflow จริงจากระบบหลังบ้าน n8n',
        visualBody: 'นี่คือโฟลว์จริงที่รับข้อความเข้า ดึงข้อมูลจาก Sheets จัดรูปแบบคำตอบ และแจ้งแอดมินเฉพาะตอนที่จำเป็นต้องมีคนจริงเข้ามาช่วย',
        stepLabel: 'ขั้นตอน',
      },
      carousel: {
        eyebrow: 'แคตตาล็อกสินค้า',
        title: 'สินค้าของคุณ โชว์สวย ๆ ในแชทได้เลย',
        description:
          'ลูกค้าเลื่อนดูการ์ดสินค้าในแชทได้เลย — กดถามราคา ดูรายละเอียด หรือสั่งซื้อได้ทันที ไม่ต้องโหลดแอป',
        cardCounter: 'การ์ด',
        of: 'จาก',
        carouselTitle: 'ตัวอย่างสินค้าในแชท',
        halfKg: 'ครึ่งกิโล',
        oneKg: '1 กิโล',
        button: 'สนใจสินค้านี้',
      },
      sheet: {
        eyebrow: 'จัดการง่าย',
        title: 'แก้ราคาใน Google Sheets — บอทตอบใหม่ทันที',
        description:
          'ไม่ต้องเขียนโค้ด แค่แก้ราคาหรือ FAQ ในตาราง บอทก็ใช้ข้อมูลใหม่ได้เลย ทีมงานคุณควบคุมได้เองทั้งหมด',
        columns: {
          product: 'สินค้า',
          halfKg: 'ครึ่งกิโล',
          oneKg: '1 กิโล',
        },
        tip: 'ลองแก้ราคาด้านบน แล้วกดถามราคาสินค้าในแชทเดโมดู',
      },
      demo: {
        eyebrow: 'ลองเล่นดู',
        title: 'AI ตัวเดียว ใช้ได้ทุกแพลตฟอร์มที่ลูกค้าคุณใช้',
        description:
          'บอทตัวเดียวกันรันได้บน Facebook Messenger, Instagram DM, Line และ Telegram สลับแพลตฟอร์มด้านล่าง แล้วลองกดดูได้เลย',
        scenariosEyebrow: 'เลือกสถานการณ์',
        scenariosDescription: 'กดปุ่มเพื่อดูว่า AI ตอบยังไงบน {platform}',
        mockDataTitle: 'รูปแบบจริง',
        mockDataBody: 'อ้างอิงจากร้านค้าที่ใช้งานจริง',
        scriptedTitle: 'ครบทุก use case',
        scriptedBody: 'ราคา FAQ รูปสินค้า QR และส่งต่อแอดมิน',
        workflowTitle: 'Workflow เดียว',
        workflowBody: 'สร้างครั้งเดียวบน n8n ใช้ได้ 4 แพลตฟอร์ม',
        demoConversation: 'ตัวอย่างบทสนทนา',
        interactive: 'กดเล่นได้',
        interested: 'สนใจ',
        alert: 'เคสนี้บอทจะแจ้งแอดมินต่อทาง Telegram หรือ Line เพื่อให้คนจริงมาปิดการขาย',
      },
      platforms: {
        eyebrow: 'รองรับหลายแพลตฟอร์ม',
        title: 'เข้าถึงลูกค้าได้ทุกที่ที่พวกเขาแชท',
        description: 'ตั้งค่าครั้งเดียว ขายได้ทุกที่ AI ตัวเดียวกันรัน Facebook, Instagram, Telegram และ Line — ไม่ต้องตั้งค่าเพิ่มต่อช่องทาง',
      },
    },
    featureCards: [
      {
        title: 'ลดต้นทุนแอดมิน',
        description: 'ไม่ต้องจ้างแอดมินตอบแชทอีกต่อไป AI รับมือกว่า 90% ของคำถามลูกค้าโดยอัตโนมัติ ทั้งหมดไม่ถึง ฿2,000/เดือน',
        stat: 'ไม่ถึง ฿2k/ด.',
      },
      {
        title: 'ปรับแต่งได้เต็มที่',
        description: 'ทุกคำตอบ การ์ดสินค้า และ FAQ ปรับตามร้านคุณได้หมด แก้ข้อมูลใน Google Sheets บอทปรับตามทันที',
        stat: 'ร้านคุณ กฎคุณ',
      },
      {
        title: 'พิสูจน์แล้วในร้านจริง',
        description: 'ใช้งานจริงแล้วกับลูกค้าจริง ไม่ใช่แค่ prototype แต่เป็นระบบที่พร้อมใช้งานได้วันนี้',
        stat: 'ผลงานจริง',
      },
      {
        title: '4 แพลตฟอร์ม ตั้งค่าครั้งเดียว',
        description: 'Facebook, Instagram, Telegram และ Line รันด้วย n8n workflow เดียว ที่ต้นทุนถูกกว่า OpenClaw 10 เท่า',
        stat: 'n8n-powered',
      },
    ],
    workflowSteps: [
      {
        title: 'ลูกค้าส่งข้อความมา',
        body: 'ลูกค้าถามราคา ขอดูรายละเอียดสินค้า ถามเรื่องจัดส่ง หรืออยากสั่งซื้อผ่านแชท',
      },
      {
        title: 'AI เข้าใจคำถาม',
        body: 'n8n วิเคราะห์ข้อความ — ถามราคา FAQ ขอรูปสินค้า ขอ QR หรือต้องส่งต่อคน?',
      },
      {
        title: 'ดึงข้อมูลล่าสุด',
        body: 'ราคาและ FAQ ดึงจาก Google Sheets แบบสด — อัปเดตตลอด ไม่ต้องเขียนโค้ด',
      },
      {
        title: 'ส่งคำตอบที่ใช่ทันที',
        body: 'AI ตอบเป็นข้อความ รูปสินค้า carousel QR หรือส่งต่อแอดมินจริง — ทั้งหมดภายในไม่กี่วินาที',
      },
    ],
    platformDetails: [
      'ครบทุกอย่าง: carousel สินค้า, ปุ่ม postback, ส่งรูปสินค้า และ QR จ่ายเงิน — ทั้งหมดใน Messenger',
      'ขายผ่าน DM ด้วย AI ตัวเดียวกัน Quick replies และการ์ดสินค้าทำงานได้ลื่นไหลบน Instagram',
      'รับแจ้งเตือนทันทีเมื่อลูกค้าต้องการคนจริง ทีมแอดมินไม่พลาดเคสผ่าน Telegram',
      'เหมาะสำหรับตลาดไทย รองรับ rich menu และ direct chat ตรงที่ลูกค้าคุณอยู่แล้ว',
    ],
    productNames: { p1: 'สินค้า A', p2: 'สินค้า B', p3: 'สินค้า C', p4: 'สินค้า D' },
    productDescriptions: {
      p1: 'สินค้าเด่นสำหรับโชว์การ์ดแบบคลิกสนใจได้ในครั้งเดียว',
      p2: 'ตัวอย่างสินค้าที่ใช้สาธิตการตอบราคาจากข้อมูลโครงสร้าง',
      p3: 'ตัวอย่างสินค้าที่ใช้สาธิตการส่งรูปสินค้าในแชท',
      p4: 'ใช้แสดงให้เห็นว่า catalog หนึ่งชุดสามารถมีหลายการ์ดและหลาย postback ได้',
    },
    badges: { p1: 'ขายดี', p2: 'มาใหม่', p3: 'ขายไว', p4: 'พร้อมจัดเซ็ต' },
    quickActions: {
      catalog: { label: 'ดู catalog carousel', userText: 'ขอดูสินค้าทั้งหมด' },
      'price-a': { label: 'ถามราคาสินค้า A', userText: 'สินค้า A ราคาเท่าไหร่' },
      'price-b': { label: 'ถามราคาสินค้า B', userText: 'สินค้า B ราคาเท่าไหร่' },
      'faq-shipping': { label: 'ถามเรื่องจัดส่ง', userText: 'วันนี้จัดส่งได้ไหม' },
      'faq-delivery': { label: 'ถามระยะเวลาส่ง', userText: 'ส่งกี่วันถึง' },
      'image-b': { label: 'ขอดูรูปสินค้า', userText: 'ขอดูรูปสินค้า B' },
      qr: { label: 'ขอ QR', userText: 'ส่ง QR ให้หน่อย' },
      order: { label: 'ลองสั่งซื้อ', userText: 'อยากสั่งซื้อเลย' },
    },
    sheetScenarios: {
      source: {
        title: 'ใช้ Google Sheets เป็นแหล่งข้อมูลหลัก',
        body: 'ลองแก้ข้อมูลในตารางด้านล่าง แล้วข้อความตอบเรื่องราคาจะเปลี่ยนตามทันที',
      },
      unified: {
        title: 'สินค้า + FAQ อยู่ในโมเดลเดียวกัน',
        body: 'ตารางชุดเดียวสามารถเป็นฐานข้อมูลให้ทั้งคำตอบเรื่องราคา FAQ และปุ่มใน catalog ได้',
      },
    },
    botLabels: {
      intro: 'AI Commerce Bot',
      carousel: 'Carousel',
      sheets: 'Google Sheets',
      faq: 'FAQ',
      image: 'รูปสินค้า',
      qr: 'QR Flow',
      alert: 'Admin Alert',
      agent: 'AI Agent',
    },
    botIntro: 'นี่คือเดโม AI Chatbot ที่ใช้งานจริงแล้วในร้านค้า กดเลือกสถานการณ์ด้านล่างเพื่อดูว่าบอทตอบยังไง',
    faqAnswers: {
      shipping: 'ระบบแพ็กของทุกวันและตัดรอบส่งก่อน 13:00 สำหรับออเดอร์ที่พร้อมจัดส่ง',
      cod: 'เดโมนี้รองรับเก็บเงินปลายทางโดยไม่บวกค่าบริการเพิ่ม',
      'delivery-time': 'โดยทั่วไปสินค้าจะถึงปลายทางภายใน 1-2 วันทำการหลังจัดส่ง',
    },
    botReplies: {
      catalog: 'นี่คือสินค้าของร้าน — ลูกค้าเลื่อนดูและกดถามได้ทันที',
      priceSuffixA: 'ราคานี้ดึงจาก Google Sheets แบบสด แก้ในชีต บอทก็ตอบราคาใหม่ทันที',
      priceSuffixB: 'ระบบตอบราคาชุดเดียวกัน ใช้ได้ทั้ง 4 แพลตฟอร์ม — แก้ครั้งเดียว ตอบได้ทุกที่',
      imageB: 'รูปสินค้าส่งให้ทันที — ไม่ต้องรอแอดมิน',
      qr: 'สร้างลิงก์ QR จ่ายเงินอัตโนมัติสำหรับลูกค้าพร้อมชำระ',
      order: 'เคสนี้บอทส่งต่อแอดมินตัวจริงผ่าน Telegram หรือ Line เพื่อปิดการขาย',
      fallback: 'AI พร้อมช่วยคุณครับ',
    },
  },
}

const productIdByName = {
  'Product A': 'p1',
  'Product B': 'p2',
  'Product C': 'p3',
  'Product D': 'p4',
}

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`max-w-2xl space-y-3 ${alignClass}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-400">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="text-base leading-7 text-slate-300">{description}</p>}
    </div>
  )
}

const getProductName = (productId, copy) => copy.productNames[productId] || productId

const getProductDescription = (productId, copy) => copy.productDescriptions[productId] || ''

const getInitialMessages = (copy) => [
  {
    id: 'intro-bot',
    role: 'bot',
    kind: 'text',
    label: copy.botLabels.intro,
    text: copy.botIntro,
  },
]

const getBotReply = (action, sheetRows, copy) => {
  const rowA = sheetRows.find((row) => row.product === 'Product A')
  const rowB = sheetRows.find((row) => row.product === 'Product B')
  const rowC = sheetRows.find((row) => row.product === 'Product C')
  const byFaq = (key) => copy.faqAnswers[key]

  switch (action) {
    case 'catalog':
      return {
        kind: 'carousel',
        label: copy.botLabels.carousel,
        text: copy.botReplies.catalog,
      }
    case 'price-a':
      return {
        kind: 'text',
        label: copy.botLabels.sheets,
        text: `${getProductName('p1', copy)}\n\n${copy.sections.carousel.halfKg} - $${rowA.halfKgPrice}\n${copy.sections.carousel.oneKg} - $${rowA.oneKgPrice}\n\n${copy.botReplies.priceSuffixA}`,
      }
    case 'faq-shipping':
      return {
        kind: 'text',
        label: copy.botLabels.faq,
        text: byFaq('shipping'),
      }
    case 'image-b':
      return {
        kind: 'image',
        label: copy.botLabels.image,
        text: copy.botReplies.imageB,
        image: products[1].image,
      }
    case 'qr':
      return {
        kind: 'qr',
        label: copy.botLabels.qr,
        text: copy.botReplies.qr,
      }
    case 'order':
      return {
        kind: 'alert',
        label: copy.botLabels.alert,
        text: copy.botReplies.order,
      }
    case 'faq-delivery':
      return {
        kind: 'text',
        label: copy.botLabels.faq,
        text: byFaq(rowC.faqKey),
      }
    case 'price-b':
      return {
        kind: 'text',
        label: copy.botLabels.sheets,
        text: `${getProductName('p2', copy)}\n\n${copy.sections.carousel.halfKg} - $${rowB.halfKgPrice}\n${copy.sections.carousel.oneKg} - $${rowB.oneKgPrice}\n\n${copy.botReplies.priceSuffixB}`,
      }
    default:
      return {
        kind: 'text',
        label: copy.botLabels.agent,
        text: copy.botReplies.fallback,
      }
  }
}

const quickActions = [
  { id: 'catalog' },
  { id: 'price-a' },
  { id: 'price-b' },
  { id: 'faq-shipping' },
  { id: 'faq-delivery' },
  { id: 'image-b' },
  { id: 'qr' },
  { id: 'order' },
]

const sheetDemoScenarios = [{ id: 'source' }, { id: 'unified' }]

function App() {
  const [sheetRows, setSheetRows] = useState(initialSheetRows)
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState(getInitialMessages(translations.en))
  const [isTyping, setIsTyping] = useState(false)
  const [activeProductIndex, setActiveProductIndex] = useState(0)
  const [activePlatform, setActivePlatform] = useState('facebook')

  const copy = translations[language]
  const currentTheme = chatPlatforms.find((p) => p.id === activePlatform) || chatPlatforms[0]

  const activeProduct = products[activeProductIndex]

  const carouselScenarioByProductId = {
    p1: 'price-a',
    p2: 'price-b',
    p3: 'image-b',
    p4: 'catalog',
  }

  const livePriceSnippet = useMemo(() => {
    const row = sheetRows.find((item) => item.product === 'Product A')
    return `${getProductName('p1', copy)} ${language === 'th' ? 'ตอนนี้ตอบราคาเป็น' : 'now responds with'} $${row.halfKgPrice} / $${row.oneKgPrice}`
  }, [copy, language, sheetRows])

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setMessages(getInitialMessages(copy))
    }, 0)
    return () => clearTimeout(welcomeTimer)
  }, [copy])

  const handleScenario = (actionId) => {
    const action = quickActions.find((item) => item.id === actionId)
    if (!action || isTyping) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      kind: 'text',
      text: copy.quickActions[action.id].userText,
    }

    const botReply = getBotReply(actionId, sheetRows, copy)

    setMessages((current) => [...current, userMessage])
    setIsTyping(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          ...botReply,
        },
      ])
      if (botReply.kind === 'carousel') {
        setActiveProductIndex(0)
      }
      if (botReply.kind === 'image') {
        setActiveProductIndex(1)
      }
      setIsTyping(false)
    }, 900)
  }

  const updatePrice = (id, field, value) => {
    const numericValue = Number(value)
    setSheetRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: Number.isNaN(numericValue) ? 0 : numericValue } : row)),
    )
  }

  const nextProduct = () => {
    setActiveProductIndex((current) => (current + 1) % products.length)
  }

  const prevProduct = () => {
    setActiveProductIndex((current) => (current - 1 + products.length) % products.length)
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-20 mb-10 rounded-full border border-white/10 bg-slate-900/70 px-5 py-3 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-400 shadow-glow">
                <img src={n8nLogo} alt="n8n logo" className="h-7 w-7 rounded-xl object-contain" />
              </div>
              <div>
                <p className="text-sm text-slate-400">{copy.nav.demoTag}</p>
                <p className="font-semibold tracking-tight text-white">{copy.nav.brand}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <a className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white" href="#features">
                {copy.nav.features}
              </a>
              <a className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white" href="#architecture">
                {copy.nav.flow}
              </a>
              <a className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white" href="#demo">
                {copy.nav.demo}
              </a>
              <a className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white" href="#platforms">
                {copy.nav.platforms}
              </a>
              </nav>
              <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setLanguage('th')}
                  className={`rounded-full px-3 py-1.5 transition ${language === 'th' ? 'bg-white text-slate-950' : 'text-slate-300'}`}
                >
                  {copy.hero.languageTh}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-3 py-1.5 transition ${language === 'en' ? 'bg-white text-slate-950' : 'text-slate-300'}`}
                >
                  {copy.hero.languageEn}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-24">
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-500/10 px-4 py-2 text-sm text-accent-300"
              >
                <Sparkles className="h-4 w-4" />
                {copy.hero.badge}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl"
              >
                {copy.hero.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
              >
                {copy.hero.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-400 to-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                >
                  {copy.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#architecture"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  {copy.hero.secondaryCta}
                </a>
              </motion.div>
              <div className="mt-10 flex flex-wrap gap-3">
                {channelBadges.map((channel) => (
                  <span
                    key={channel.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    {channel.logo ? <img src={channel.logo} alt={channel.label} className="h-5 w-5 rounded-full object-contain" /> : null}
                    {channel.label}
                  </span>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/40"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.12),_transparent_24%)]" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{copy.hero.summaryEyebrow}</p>
                    <p className="text-xl font-semibold text-white">{copy.hero.summaryTitle}</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                    {copy.hero.demoMode}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featureCards.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-accent-500/15 p-3 text-accent-400">
                            {item.logo ? (
                              <img src={item.logo} alt={item.title} className="h-5 w-5 rounded-md object-contain" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{copy.featureCards[featureCards.indexOf(item)].title}</p>
                            <p className="text-sm text-accent-300">{copy.featureCards[featureCards.indexOf(item)].stat}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-300">{copy.featureCards[featureCards.indexOf(item)].description}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="rounded-3xl border border-white/8 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{copy.hero.liveSheetSnippet}</p>
                      <p className="mt-1 font-medium text-white">{livePriceSnippet}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      {copy.hero.sanitizeTag}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section id="features" className="space-y-10">
            <SectionHeading
              eyebrow={copy.sections.features.eyebrow}
              title={copy.sections.features.title}
              description={copy.sections.features.description}
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="rounded-2xl bg-accent-500/15 p-3 text-accent-400">
                        {item.logo ? (
                          <img src={item.logo} alt={item.title} className="h-6 w-6 rounded-md object-contain" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {copy.featureCards[index].stat}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{copy.featureCards[index].title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{copy.featureCards[index].description}</p>
                  </motion.article>
                )
              })}
            </div>
          </section>

          <section id="architecture" className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={copy.sections.architecture.eyebrow}
                title={copy.sections.architecture.title}
                description={copy.sections.architecture.description}
              />
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]">
                <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                    <img src={n8nLogo} alt="n8n" className="h-5 w-5 rounded-md object-contain" />
                    n8n
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                    <img src={googleSheetsLogo} alt="Google Sheets" className="h-5 w-5 rounded-md object-contain" />
                    Google Sheets
                  </span>
                </div>
                <img src={workflowShowcase} alt={copy.sections.architecture.visualTitle} className="h-72 w-full bg-slate-950 object-cover" />
                <div className="space-y-2 px-5 py-4">
                  <p className="font-medium text-white">{copy.sections.architecture.visualTitle}</p>
                  <p className="text-sm leading-6 text-slate-300">{copy.sections.architecture.visualBody}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-400 to-cyan-600 opacity-70" />
                    <div className="flex items-start gap-4 pl-4">
                      <div className="rounded-2xl bg-accent-500/15 p-3 text-accent-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{copy.sections.architecture.stepLabel} 0{index + 1}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{copy.workflowSteps[index].title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{copy.workflowSteps[index].body}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <SectionHeading
                eyebrow={copy.sections.carousel.eyebrow}
                title={copy.sections.carousel.title}
                description={copy.sections.carousel.description}
              />
              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevProduct}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">{copy.sections.carousel.cardCounter} {activeProductIndex + 1} {copy.sections.carousel.of} {products.length}</p>
                    <p className="font-medium text-white">{copy.sections.carousel.carouselTitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={nextProduct}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProduct.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.28 }}
                    className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]"
                  >
                    <img
                      src={activeProduct.image}
                      alt={getProductName(activeProduct.id, copy)}
                      className="h-72 w-full rounded-[1.5rem] object-cover"
                    />
                    <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
                      <div>
                        <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-medium text-accent-300">
                          {copy.badges[activeProduct.id]}
                        </span>
                        <h3 className="mt-4 text-2xl font-semibold text-white">{getProductName(activeProduct.id, copy)}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{getProductDescription(activeProduct.id, copy)}</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <p className="text-sm text-slate-400">{copy.sections.carousel.halfKg}</p>
                            <p className="mt-1 text-lg font-semibold text-white">${activeProduct.halfKgPrice}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <p className="text-sm text-slate-400">{copy.sections.carousel.oneKg}</p>
                            <p className="mt-1 text-lg font-semibold text-white">${activeProduct.oneKgPrice}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleScenario(carouselScenarioByProductId[activeProduct.id])}
                        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-accent-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent-400"
                      >
                        {copy.sections.carousel.button}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <SectionHeading
                eyebrow={copy.sections.sheet.eyebrow}
                title={copy.sections.sheet.title}
                description={copy.sections.sheet.description}
              />
              <div className="mt-6 space-y-4">
                {sheetDemoScenarios.map((scenario) => (
                  <div key={scenario.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="font-medium text-white">{copy.sheetScenarios[scenario.id].title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{copy.sheetScenarios[scenario.id].body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60">
                <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-px bg-white/5 text-sm">
                  <div className="bg-slate-900/80 px-4 py-3 font-medium text-slate-300">{copy.sections.sheet.columns.product}</div>
                  <div className="bg-slate-900/80 px-4 py-3 font-medium text-slate-300">{copy.sections.sheet.columns.halfKg}</div>
                  <div className="bg-slate-900/80 px-4 py-3 font-medium text-slate-300">{copy.sections.sheet.columns.oneKg}</div>
                  {sheetRows.map((row) => (
                    <div key={row.id} className="contents">
                      <div key={`${row.id}-product`} className="bg-slate-950/90 px-4 py-3 text-white">
                        {getProductName(productIdByName[row.product], copy)}
                      </div>
                      <div key={`${row.id}-half`} className="bg-slate-950/90 px-3 py-2">
                        <input
                          type="number"
                          value={row.halfKgPrice}
                          onChange={(event) => updatePrice(row.id, 'halfKgPrice', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 transition focus:border-accent-400"
                        />
                      </div>
                      <div key={`${row.id}-one`} className="bg-slate-950/90 px-3 py-2">
                        <input
                          type="number"
                          value={row.oneKgPrice}
                          onChange={(event) => updatePrice(row.id, 'oneKgPrice', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 transition focus:border-accent-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-accent-400/15 bg-accent-500/10 p-4 text-sm text-accent-200">
                {copy.sections.sheet.tip}
              </div>
            </div>
          </section>

          <section id="demo" className="space-y-8">
            <SectionHeading
              eyebrow={copy.sections.demo.eyebrow}
              title={copy.sections.demo.title}
              description={copy.sections.demo.description}
              align="center"
            />

            <div className="flex flex-wrap items-center justify-center gap-3">
              {chatPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => { setActivePlatform(platform.id); setMessages(getInitialMessages(copy)) }}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    activePlatform === platform.id
                      ? `${platform.headerBg} ${platform.headerText} shadow-lg`
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {platform.avatarSrc ? <img src={platform.avatarSrc} alt={platform.shortName} className="h-5 w-5 rounded-full object-contain" /> : <span>{platform.avatar}</span>} {platform.shortName}
                </button>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="mb-1 text-sm font-semibold uppercase tracking-[0.28em] text-accent-400">{copy.sections.demo.scenariosEyebrow}</p>
                  <p className="text-base leading-7 text-slate-300">{copy.sections.demo.scenariosDescription.replace('{platform}', currentTheme.name)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleScenario(action.id)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-accent-400/30 hover:bg-accent-500/10 hover:text-white"
                    >
                      {copy.quickActions[action.id].label}
                    </button>
                  ))}
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm text-slate-400">{copy.sections.demo.mockDataTitle}</p>
                    <p className="mt-2 font-medium text-white">{copy.sections.demo.mockDataBody}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm text-slate-400">{copy.sections.demo.scriptedTitle}</p>
                    <p className="mt-2 font-medium text-white">{copy.sections.demo.scriptedBody}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm text-slate-400">{copy.sections.demo.workflowTitle}</p>
                    <p className="mt-2 font-medium text-white">{copy.sections.demo.workflowBody}</p>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlatform}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className={`overflow-hidden rounded-[2rem] border ${currentTheme.wrapperBorder} shadow-2xl`}
                >
                  <div className={`flex items-center justify-between px-6 py-4 ${currentTheme.headerBg} ${currentTheme.headerText}`}>
                    <div className="flex items-center gap-3">
                      {currentTheme.avatarSrc ? (
                        <img src={currentTheme.avatarSrc} alt={currentTheme.name} className="h-9 w-9 rounded-full bg-white/90 p-1 object-contain" />
                      ) : (
                        <span className="text-2xl">{currentTheme.avatar}</span>
                      )}
                      <div>
                        <p className="text-xs opacity-80">{copy.sections.demo.demoConversation}</p>
                        <p className="font-semibold">{currentTheme.name}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{copy.sections.demo.interactive}</div>
                  </div>

                  <div className={`h-[38rem] overflow-y-auto px-4 py-5 sm:px-6 ${currentTheme.chatBg}`}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                          <div
                            className={`max-w-[85%] px-4 py-3 text-sm leading-6 shadow-sm ${
                              message.role === 'user'
                                ? currentTheme.userBubble
                                : currentTheme.botBubble
                            }`}
                          >
                            {message.role === 'bot' && message.label ? (
                              <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${currentTheme.botLabel}`}>{message.label}</p>
                            ) : null}
                            <p className="whitespace-pre-line">{message.text}</p>
                            {message.kind === 'image' && message.image ? (
                              <img src={message.image} alt="Mock product" className="mt-3 h-48 w-full rounded-2xl object-cover" />
                            ) : null}
                            {message.kind === 'qr' ? (
                              <div className="mt-3 flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                                <div className="grid h-28 w-28 grid-cols-6 gap-1">
                                  {Array.from({ length: 36 }).map((_, index) => (
                                    <div key={index} className={`${index % 2 === 0 || index % 5 === 0 ? 'bg-slate-800' : 'bg-slate-300'} rounded-sm`} />
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {message.kind === 'alert' ? (
                              <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
                                {copy.sections.demo.alert}
                              </div>
                            ) : null}
                            {message.kind === 'carousel' ? (
                              <div className="mt-4 grid gap-3">
                                {products.slice(0, 3).map((product) => (
                                  <div key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <div className="flex gap-3 p-3">
                                      <img src={product.image} alt={getProductName(product.id, copy)} className="h-20 w-20 rounded-xl object-cover" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-slate-900">{getProductName(product.id, copy)}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">{getProductDescription(product.id, copy)}</p>
                                        <button
                                          type="button"
                                          onClick={() => handleScenario(carouselScenarioByProductId[product.id])}
                                          className={`mt-2 rounded-full px-3 py-1.5 text-xs font-medium text-white transition ${currentTheme.headerBg} hover:opacity-80`}
                                        >
                                          {copy.sections.demo.interested}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                      {isTyping ? (
                        <div className="flex justify-start">
                          <div className={`px-4 py-3 ${currentTheme.botBubble}`}>
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 animate-bounce rounded-full ${currentTheme.typingDot} [animation-delay:-0.3s]`} />
                              <span className={`h-2.5 w-2.5 animate-bounce rounded-full ${currentTheme.typingDot} [animation-delay:-0.15s]`} />
                              <span className={`h-2.5 w-2.5 animate-bounce rounded-full ${currentTheme.typingDot}`} />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          <section id="platforms" className="space-y-10">
            <SectionHeading
              eyebrow={copy.sections.platforms.eyebrow}
              title={copy.sections.platforms.title}
              description={copy.sections.platforms.description}
              align="center"
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {platformCards.map((platform, index) => {
                const Icon = platform.icon
                return (
                  <motion.article
                    key={platform.name}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${platform.color} p-[1px]`}
                  >
                    <div className="h-full rounded-[1.7rem] bg-slate-950/95 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-accent-300">
                        {platform.logo ? (
                          <img src={platform.logo} alt={platform.name} className="h-7 w-7 rounded-md object-contain" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-white">{platform.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{copy.platformDetails[index]}</p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
    </ErrorBoundary>
  )
}

export default App
