'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BN } from '@coral-xyz/anchor';
import { toast } from 'sonner';
import { getProgram, createCampaign, CreateCampaignParams } from '@/lib/solana/anchor-client';

const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(64, 'Name too long'),
  payoutAmount: z.string().min(1, 'Payout amount is required'),
  maxPayouts: z.string().min(1, 'Max payouts is required'),
  durationDays: z.string().optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: CampaignForm) => {
    if (!publicKey || !wallet) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating campaign...');

    try {
      const program = getProgram(connection, wallet.adapter as any);

      // Convert string amounts to BN (assuming USDC with 6 decimals)
      const payoutAmount = new BN(parseFloat(data.payoutAmount) * 1_000_000);
      const maxPayouts = new BN(parseInt(data.maxPayouts));
      const startTimestamp = new BN(Math.floor(Date.now() / 1000));

      let endTimestamp: BN | null = null;
      if (data.durationDays) {
        const durationSeconds = parseInt(data.durationDays) * 24 * 60 * 60;
        endTimestamp = new BN(Math.floor(Date.now() / 1000) + durationSeconds);
      }

      const params: CreateCampaignParams = {
        name: data.name,
        payoutAmount,
        maxPayouts,
        startTimestamp,
        endTimestamp,
      };

      const signature = await createCampaign(program, wallet.adapter as any, params);

      toast.success('Campaign created successfully!', { id: toastId });
      toast.info(`Transaction: ${signature.slice(0, 8)}...`, {
        action: {
          label: 'View',
          onClick: () =>
            window.open(
              `https://solscan.io/tx/${signature}?cluster=devnet`,
              '_blank'
            ),
        },
      });

      reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error?.message || 'Failed to create campaign', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Campaign</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Campaign Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Holiday Sale Signups"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payout Amount (USDC)
              </label>
              <input
                {...register('payoutAmount')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5.00"
                disabled={isSubmitting}
              />
              {errors.payoutAmount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payoutAmount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Payouts
              </label>
              <input
                {...register('maxPayouts')}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                disabled={isSubmitting}
              />
              {errors.maxPayouts && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxPayouts.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (Days) - Optional
              </label>
              <input
                {...register('durationDays')}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty for no end date
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting || !publicKey}
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

