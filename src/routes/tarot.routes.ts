import { Router } from 'express';
import { analyzeTarot, getTodayStats, incrementTodayStats } from '../controllers/tarot.controller';

const router = Router();

// POST /api/tarot/analyze
router.post('/analyze', analyzeTarot);

// GET /api/tarot/stats/today  → 오늘 타로 결과 조회 수
router.get('/stats/today', getTodayStats);

// POST /api/tarot/stats/today → 타로 결과 확인 후 +1
router.post('/stats/today', incrementTodayStats);

export default router;
