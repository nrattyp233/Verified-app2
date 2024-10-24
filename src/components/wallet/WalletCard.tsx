import React from 'react';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/format';
import { Wallet, Lock, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function WalletCard() {
  const { balance, lockedBalance } = useWalletStore();

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wallet className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Your Wallet</h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <ArrowUpRight className="w-4 h-4 mr-1" />
          Add Funds
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-sm text-white/80 mb-1">Available Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center mb-1">
            <Lock className="w-4 h-4 mr-1" />
            <p className="text-sm text-white/80">Locked Balance</p>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(lockedBalance)}</p>
        </div>
      </div>
    </div>
  );
}