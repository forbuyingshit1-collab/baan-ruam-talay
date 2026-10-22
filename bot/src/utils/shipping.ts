import { config } from '../config/index.js';

export function getShippingInfo(): { canShipToday: boolean; shippingMessage: string } {
  const now = new Date();
  const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const currentHour = bangkokTime.getHours();
  const cutoffHour = config.business.shippingCutoffHour;

  const canShipToday = currentHour < cutoffHour;

  const shippingMessage = canShipToday
    ? `สั่งตอนนี้ ส่งวันนี้เลยครับ (${config.business.shippingCarrier})`
    : `สั่งตอนนี้ ส่งพรุ่งนี้ครับ (ตัดรอบ ${cutoffHour}.00 น.)`;

  return { canShipToday, shippingMessage };
}

export function formatShippingDate(canShipToday: boolean): string {
  const now = new Date();
  const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

  if (!canShipToday) {
    bangkokTime.setDate(bangkokTime.getDate() + 1);
  }

  const day = bangkokTime.getDate();
  const month = bangkokTime.getMonth() + 1;
  const year = bangkokTime.getFullYear() + 543;

  return `${day}/${month}/${year}`;
}

export function getCurrentBangkokTime(): Date {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
}
