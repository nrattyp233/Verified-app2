import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'expired', 'cancelled'],
    default: 'pending',
  },
  proximityRadius: {
    type: Number,
    required: true,
    min: 1,
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 5,
  },
  location: {
    type: {
      lat: Number,
      lng: Number,
    },
    required: true,
  },
  geofenceEnabled: {
    type: Boolean,
    default: false,
  },
  walletDeposit: {
    type: Boolean,
    default: false,
  },
  serviceFee: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);