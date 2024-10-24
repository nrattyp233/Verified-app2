export const platformConfig = {
  serviceFeePercentage: 3,
  merchantAccountId: process.env.STRIPE_ACCOUNT_ID,
  minTransactionAmount: 1,
  maxTransactionAmount: 10000,
  supportedCurrencies: ['USD'],
  geofencingEnabled: true,
  maxProximityRadius: 1000, // meters
  maxTimeLimit: 120, // minutes
};