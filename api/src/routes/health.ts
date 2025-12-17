import { Router } from 'express';
const router = Router();

router.get('/health', async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

export default router;
