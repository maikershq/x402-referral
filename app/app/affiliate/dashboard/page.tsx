'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { NavBar } from '@/components/NavBar';
import { useEffect } from 'react';

export default function AffiliateDashboard() {
  const { connected, publicKey } = useWallet();

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
              Please connect your Solana wallet to access the affiliate dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">$0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600">$0</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Conversions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Available Campaigns</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Campaign cards will be populated here */}
                  <p className="col-span-full text-gray-500 text-center py-8">
                    No campaigns available. Check back later or create a campaign as a merchant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

