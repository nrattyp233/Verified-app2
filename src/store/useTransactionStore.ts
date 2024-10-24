import { create } from 'zustand';
import { Transaction, TransactionStatus } from '../types/transaction';

interface TransactionStore {
  transactions: Transaction[];
  activeTransaction: Transaction | null;
  setActiveTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  getTransaction: (id: string) => Transaction | undefined;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  activeTransaction: null,
  setActiveTransaction: (transaction) => set({ activeTransaction: transaction }),
  addTransaction: (transaction) => 
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransactionStatus: (id, status) => 
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
  getTransaction: (id) => get().transactions.find((t) => t.id === id),
}));