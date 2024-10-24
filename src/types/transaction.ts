export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: TransactionStatus;
  proximityRadius: number;
  timeLimit: number;
  createdAt: number;
  expiresAt: number;
  geofenceEnabled: boolean;
  walletDeposit: boolean;
  serviceFee: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export type TransactionStatus = 
  | 'pending'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  lockedBalance: number;
  transactions: Transaction[];
}