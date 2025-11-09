'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { NavBar } from '@/components/NavBar';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { useState } from 'react';

export default function MerchantDashboard() {
  const { connected, publicKey } = useWallet();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!connected ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your Solana wallet to access the merchant dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Merchant Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Campaigns</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Payouts</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">$0</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Campaigns</h2>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No campaigns yet. Create your first campaign to get started.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh campaigns list
        }}
      />
    </div>
  );
}

