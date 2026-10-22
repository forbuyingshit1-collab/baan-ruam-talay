import { Router, Request, Response } from 'express';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { messageHandler } from '../handlers/message.handler.js';
import { MessengerWebhookEvent, IncomingMessage } from '../types/index.js';

const router = Router();

router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  logger.info('Webhook verification request received');

  if (mode === 'subscribe' && token === config.facebook.verifyToken) {
    logger.info('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    logger.warn('Webhook verification failed');
    res.sendStatus(403);
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body as MessengerWebhookEvent;

    if (body.object !== 'page') {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(200);

    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message?.is_echo || event.delivery || event.read) {
          continue;
        }

        const senderId = event.sender.id;

        if (event.postback) {
          await messageHandler.handlePostback(senderId, event.postback.payload);
          continue;
        }

        if (event.message?.text) {
          const incomingMessage: IncomingMessage = {
            platform: 'messenger',
            senderId,
            pageId: entry.id,
            text: event.message.text.trim(),
            isPostback: false,
            timestamp: event.timestamp,
            rawPayload: event,
          };

          await messageHandler.handleMessage(incomingMessage);
        }
      }
    }
  } catch (error) {
    logger.error('Error processing webhook:', error);
  }
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'baan-ruam-talay-bot',
  });
});

export { router as webhookRoutes };
