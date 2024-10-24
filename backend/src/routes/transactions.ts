import express from 'express';
import {
  createTransaction,
  completeTransaction,
} from '../controllers/transactionController';

const router = express.Router();

router.post('/', createTransaction);
router.post('/:transactionId/complete', completeTransaction);

export default router;