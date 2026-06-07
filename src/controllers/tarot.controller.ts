import { Request, Response } from 'express';
import { analyzeTarotWithOpenAI, TarotCard } from '../services/openai.service';
import { saveReading, getTodayCount, incrementTodayCount } from '../services/firestore.service';

export const analyzeTarot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, mbti, category, cards } = req.body as {
      uid?: string;
      mbti: string;
      category: string;
      cards: TarotCard[];
    };

    if (!mbti || !category || !Array.isArray(cards) || cards.length !== 3) {
      res.status(400).json({ error: 'Required fields are missing or cards must be exactly 3.' });
      return;
    }

    console.log(`[Request received] UID: ${uid ?? 'anonymous'}, MBTI: ${mbti}, Category: ${category}`);

    const resultText = await analyzeTarotWithOpenAI({ mbti, category, cards });
    const docId = await saveReading(uid ?? 'anonymous', mbti, category, cards, resultText);

    res.status(200).json({ resultText, docId });
  } catch (error) {
    console.error('Error during tarot analysis:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

export const getTodayStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todayCount = await getTodayCount();
    res.status(200).json({ todayCount });
  } catch (error) {
    console.error('Error fetching today stats:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

export const incrementTodayStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todayCount = await incrementTodayCount();
    res.status(200).json({ todayCount });
  } catch (error) {
    console.error('Error incrementing today stats:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
