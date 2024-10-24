import { Request, Response } from 'express';
import { Wallet } from '../models/Wallet';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function getWallet(req: Request, res: Response) {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id })
      .populate('transactions');
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet' });
  }
}

export async function addFunds(req: Request, res: Response) {
  try {
    const { amount, paymentMethodId } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/wallet`,
    });

    if (paymentIntent.status === 'succeeded') {
      wallet.balance += amount;
      await wallet.save();
      res.json({ success: true, wallet });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding funds' });
  }
}