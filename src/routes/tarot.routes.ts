import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth';
import { analyzeTarot } from '../controllers/tarot.controller';

const router = Router();

// POST /api/tarot/analyze
// Verifies Firebase token, accepts 3 tarot cards + MBTI, returns Gemini AI analysis
router.post('/analyze', verifyFirebaseToken, analyzeTarot);

export default router;
