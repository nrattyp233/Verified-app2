import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Wallet } from '../models/Wallet';
import { calculateServiceFee } from '../utils/fees';

export async function createTransaction(req: Request, res: Response) {
  try {
    const {
      receiverId,
      amount,
      proximityRadius,
      timeLimit,
      location,
      geofenceEnabled,
      walletDeposit,
    } = req.body;

    const senderId = req.user.id;
    const serviceFee = calculateServiceFee(amount);
    const totalAmount = amount + serviceFee;

    // Check sender's wallet balance
    const senderWallet = await Wallet.findOne({ userId: senderId });
    if (!senderWallet || senderWallet.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Create transaction
    const transaction = new Transaction({
      senderId,
      receiverId,
      amount,
      proximityRadius,
      timeLimit,
      location,
      geofenceEnabled,
      walletDeposit,
      serviceFee,
      expiresAt: new Date(Date.now() + timeLimit * 60 * 1000),
    });

    await transaction.save();

    // Lock funds in sender's wallet
    senderWallet.balance -= totalAmount;
    senderWallet.lockedBalance += totalAmount;
    senderWallet.transactions.push(transaction._id);
    await senderWallet.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction' });
  }
}

export async function completeTransaction(req: Request, res: Response) {
  try {
    const { transactionId } = req.params;
    const { currentLocation } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'active') {
      return res.status(400).json({ message: 'Transaction cannot be completed' });
    }

    // Verify proximity if geofencing is enabled
    if (transaction.geofenceEnabled) {
      const distance = calculateDistance(
        currentLocation,
        transaction.location
      );
      if (distance > transaction.proximityRadius) {
        return res.status(400).json({ message: 'Outside transaction radius' });
      }
    }

    // Transfer funds
    const senderWallet = await Wallet.findOne({ userId: transaction.senderId });
    const receiverWallet = await Wallet.findOne({ userId: transaction.receiverId });

    if (!senderWallet || !receiverWallet) {
      return res.status(400).json({ message: 'Wallet not found' });
    }

    const totalAmount = transaction.amount + transaction.serviceFee;
    senderWallet.lockedBalance -= totalAmount;
    receiverWallet.balance += transaction.amount;

    transaction.status = 'completed';

    await Promise.all([
      senderWallet.save(),
      receiverWallet.save(),
      transaction.save(),
    ]);

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error completing transaction' });
  }
}

function calculateDistance(point1: any, point2: any) {
  // Haversine formula implementation
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.lat * Math.PI/180;
  const φ2 = point2.lat * Math.PI/180;
  const Δφ = (point2.lat-point1.lat) * Math.PI/180;
  const Δλ = (point2.lng-point1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}