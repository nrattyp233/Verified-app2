import React from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export function TransactionList() {
  const transactions = useTransactionStore((state) => state.transactions);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">
                  {formatCurrency(transaction.amount)}
                </span>
                {getStatusIcon(transaction.status)}
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {transaction.proximityRadius}m radius
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}