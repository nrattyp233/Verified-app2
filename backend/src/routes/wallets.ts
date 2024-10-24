import express from 'express';
import { getWallet, addFunds } from '../controllers/walletController';

const router = express.Router();

router.get('/', getWallet);
router.post('/add-funds', addFunds);

export default router;