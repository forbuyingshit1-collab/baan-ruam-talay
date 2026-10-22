export interface Product {
  id: string;
  name: string;
  category: 'seafood' | 'pork' | 'other';
  priceRetail: number;
  priceWholesale?: number;
  unit: string;
  imageUrl: string;
  description?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'transfer' | 'cod';
  shippingDate: string;
  createdAt: Date;
}

export interface CustomerSession {
  id: string;
  psid: string;
  platform: 'messenger' | 'line';
  cart: CartItem[];
  conversationHistory: ConversationMessage[];
  lastInteraction: Date;
  customerInfo?: {
    name?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
  };
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MessengerWebhookEvent {
  object: string;
  entry: MessengerEntry[];
}

export interface MessengerEntry {
  id: string;
  time: number;
  messaging: MessengerMessage[];
}

export interface MessengerMessage {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    is_echo?: boolean;
    attachments?: MessengerAttachment[];
  };
  postback?: {
    title: string;
    payload: string;
  };
  delivery?: unknown;
  read?: unknown;
}

export interface MessengerAttachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'location';
  payload: {
    url?: string;
    coordinates?: { lat: number; long: number };
  };
}

export interface CarouselCard {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttons: CarouselButton[];
}

export interface CarouselButton {
  type: 'postback' | 'web_url';
  title: string;
  payload?: string;
  url?: string;
}

export interface BotResponse {
  type: 'text' | 'image' | 'carousel' | 'quick_replies';
  content: string | CarouselCard[] | string;
  imageUrl?: string;
  quickReplies?: string[];
}

export type MessagePlatform = 'messenger' | 'line';

export interface IncomingMessage {
  platform: MessagePlatform;
  senderId: string;
  pageId?: string;
  text: string;
  isPostback: boolean;
  timestamp: number;
  rawPayload: unknown;
}
