import { Router, Request, Response } from 'express';
import { handleUserChatQuery } from '../services/ragService';

export const chatRouter = Router();

/**
 * POST /api/chat
 * Primary query endpoint implementing RAG retrieval with verified Web Search fallback
 */
chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', category, conversationId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await handleUserChatQuery({
      message: message.trim(),
      language: language as string,
      category: category as string,
      conversationId: conversationId as string
    });

    res.json(response);
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      error: 'An internal server error occurred while processing the chat query.',
      details: err.message
    });
  }
});
