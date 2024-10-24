import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/format';
import { Button } from './ui/Button';

interface TransactionCardProps {
  transaction: Transaction;
  onComplete?: () => void;
}

export function TransactionCard({ transaction, onComplete }: TransactionCardProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
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

  const isActive = transaction.status === 'active';
  const timeLeft = transaction.expiresAt - Date.now();
  const isExpired = timeLeft <= 0;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">
          {formatCurrency(transaction.amount)}
        </span>
        {getStatusIcon()}
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

      {isActive && !isExpired && onComplete && (
        <Button
          onClick={onComplete}
          className="w-full mt-4"
          variant="primary"
          size="sm"
        >
          Complete Transaction
        </Button>
      )}
    </div>
  );
}