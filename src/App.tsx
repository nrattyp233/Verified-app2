import React from 'react';
import { Map } from './components/Map';
import { TransactionList } from './components/transactions/TransactionList';
import { WalletCard } from './components/wallet/WalletCard';
import { SendMoneyForm } from './components/SendMoneyForm';
import { Landmark, Wallet } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Landmark className="w-8 h-8 text-emerald-500" />
                <span className="ml-2 text-xl font-bold text-white">Verified</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700">
                  <Wallet className="w-5 h-5 mr-2" />
                  <span>$1,234.56</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <WalletCard />
              <SendMoneyForm />
              <TransactionList />
            </div>
            <div className="h-[calc(100vh-12rem)] sticky top-24">
              <Map />
            </div>
          </div>
        </main>
      </div>
    </Elements>
  );
}

export default App;