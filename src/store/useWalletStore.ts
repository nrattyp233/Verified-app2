import { create } from 'zustand';
import { Wallet } from '../types/transaction';

interface WalletStore {
  balance: number;
  lockedBalance: number;
  transactions: Wallet['transactions'];
  updateBalance: (amount: number) => void;
  lockFunds: (amount: number) => boolean;
  unlockFunds: (amount: number) => void;
  addTransaction: (transaction: Wallet['transactions'][0]) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balance: 0,
  lockedBalance: 0,
  transactions: [],

  updateBalance: (amount) => 
    set((state) => ({ balance: state.balance + amount })),

  lockFunds: (amount) => {
    const { balance } = get();
    if (balance < amount) return false;

    set((state) => ({
      balance: state.balance - amount,
      lockedBalance: state.lockedBalance + amount,
    }));
    return true;
  },

  unlockFunds: (amount) =>
    set((state) => ({
      lockedBalance: state.lockedBalance - amount,
      balance: state.balance + amount,
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));