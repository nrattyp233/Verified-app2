import { create } from 'zustand';
import { ServiceFee } from '../types/platform';

interface PlatformStore {
  fees: ServiceFee[];
  totalFeesCollected: number;
  addFee: (fee: ServiceFee) => void;
  processFee: (transactionId: string) => void;
  getTotalPendingFees: () => number;
  getFeesByDateRange: (startDate: number, endDate: number) => ServiceFee[];
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  fees: [],
  totalFeesCollected: 0,

  addFee: (fee) => set((state) => ({
    fees: [...state.fees, fee]
  })),

  processFee: (transactionId) => set((state) => {
    const fee = state.fees.find(f => f.transactionId === transactionId);
    if (!fee || fee.status === 'processed') return state;

    return {
      fees: state.fees.map(f => 
        f.transactionId === transactionId 
          ? { ...f, status: 'processed' as const }
          : f
      ),
      totalFeesCollected: state.totalFeesCollected + fee.amount
    };
  }),

  getTotalPendingFees: () => {
    const { fees } = get();
    return fees
      .filter(f => f.status === 'pending')
      .reduce((total, fee) => total + fee.amount, 0);
  },

  getFeesByDateRange: (startDate, endDate) => {
    const { fees } = get();
    return fees.filter(f => 
      f.timestamp >= startDate && f.timestamp <= endDate
    );
  }
}));