import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MapPin, Clock, Wallet } from 'lucide-react';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useTransactionStore } from '../store/useTransactionStore';
import { calculateServiceFee } from '../utils/fees';

const sendMoneySchema = z.object({
  receiverId: z.string().min(1, 'Receiver is required'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  proximityRadius: z.number().min(1, 'Proximity radius is required'),
  timeLimit: z.number().min(5, 'Time limit must be at least 5 minutes'),
  walletDeposit: z.boolean().default(false),
  geofenceEnabled: z.boolean().default(false),
});

type SendMoneyForm = z.infer<typeof sendMoneySchema>;

export function SendMoneyForm() {
  const { location } = useLocationTracking();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SendMoneyForm>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      proximityRadius: 5,
      timeLimit: 30,
      walletDeposit: false,
      geofenceEnabled: false,
    },
  });

  const onSubmit = async (data: SendMoneyForm) => {
    if (!location) return;

    const serviceFee = calculateServiceFee(data.amount);
    const transaction = {
      id: crypto.randomUUID(),
      senderId: 'current-user', // Replace with actual user ID
      ...data,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + data.timeLimit * 60 * 1000,
      serviceFee,
      location,
    };

    addTransaction(transaction);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Send Money</h2>

      <Input
        label="Receiver ID"
        placeholder="Enter receiver's ID"
        error={errors.receiverId?.message}
        {...register('receiverId')}
      />

      <Input
        type="number"
        label="Amount (USD)"
        placeholder="Enter amount"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Proximity (meters)"
          icon={<MapPin className="w-4 h-4" />}
          error={errors.proximityRadius?.message}
          {...register('proximityRadius', { valueAsNumber: true })}
        />

        <Input
          type="number"
          label="Time Limit (minutes)"
          icon={<Clock className="w-4 h-4" />}
          error={errors.timeLimit?.message}
          {...register('timeLimit', { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox text-emerald-500"
            {...register('walletDeposit')}
          />
          <span className="text-white">Deposit to receiver's wallet</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox text-emerald-500"
            {...register('geofenceEnabled')}
          />
          <span className="text-white">Enable geofencing</span>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={!location}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Send Money
      </Button>
    </form>
  );
}