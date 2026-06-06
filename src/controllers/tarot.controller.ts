import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth';
import { analyzeTarotWithGemini, TarotCard } from '../services/gemini.service';

export const analyzeTarot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mbti, category, cards } = req.body as {
      mbti: string;
      category: string;
      cards: TarotCard[];
    };

    if (!mbti || !category || !Array.isArray(cards) || cards.length !== 3) {
      res.status(400).json({ error: 'Required fields are missing or cards must be exactly 3.' });
      return;
    }

    console.log(`[Request received] UID: ${req.uid}, MBTI: ${mbti}, Category: ${category}`);

    const resultText = await analyzeTarotWithGemini({ mbti, category, cards });

    res.status(200).json({ resultText });
  } catch (error) {
    console.error('Error during tarot analysis:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
