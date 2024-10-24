import { PlatformConfig } from '../types/platform';

const platformConfig: PlatformConfig = {
  serviceFeePercentage: 3,
  merchantAccountId: 'your_stripe_account_id', // Replace with your actual Stripe account
  minTransactionAmount: 1,
  maxTransactionAmount: 10000
};

export function calculateServiceFee(amount: number): number {
  return (amount * platformConfig.serviceFeePercentage) / 100;
}

export function validateTransaction(amount: number): boolean {
  return amount >= platformConfig.minTransactionAmount && 
         amount <= platformConfig.maxTransactionAmount;
}