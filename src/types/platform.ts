export interface PlatformConfig {
  serviceFeePercentage: number;
  merchantAccountId: string; // Your business account ID only
  minTransactionAmount: number;
  maxTransactionAmount: number;
}

export interface ServiceFee {
  amount: number;
  transactionId: string;
  timestamp: number;
  status: 'pending' | 'processed';
}

// This ensures only platform owner can access fee data
export interface PlatformOwnerAccess {
  readonly merchantAccountId: string; // Immutable after initial setup
  readonly ownerUserId: string; // Your admin user ID
  isAuthorizedAdmin: (userId: string) => boolean;
}