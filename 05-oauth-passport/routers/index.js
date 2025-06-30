import express from 'express';
import authRouter from './authRouter.js';
import postRouter from './postRouter.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Check Browser Cookies!');
});

router.use(authRouter);
router.use(postRouter);

export default router;