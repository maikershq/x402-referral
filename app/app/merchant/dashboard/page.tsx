'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { NavBar } from '@/components/NavBar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MerchantDashboard() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      // Optionally redirect or show message
    }
  }, [connected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!connected ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Solana wallet to access the merchant dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Conversions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Payouts</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">$0</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create Campaign
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  No campaigns yet. Create your first campaign to get started.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

