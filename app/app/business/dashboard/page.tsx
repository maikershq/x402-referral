'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { NavBar } from '@/components/NavBar';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { CampaignCard } from '@/components/CampaignCard';
import { useState, useEffect } from 'react';
import { getProgram, getAllCampaigns } from '@/lib/solana/anchor-client';
import { PublicKey } from '@solana/web3.js';

interface CampaignData {
  publicKey: PublicKey;
  account: any;
}

export default function BusinessDashboard() {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    if (!connected || !publicKey || !wallet) return;

    try {
      setLoading(true);
      const program = getProgram(connection, wallet.adapter as any);
      const allCampaigns = await getAllCampaigns(program);
      
      const businessCampaigns = allCampaigns.filter(
        (c: any) => c.account.business.toBase58() === publicKey.toBase58()
      );
      
      setCampaigns(businessCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [connected, publicKey]);

  const businessCampaigns = campaigns.filter(
    (c) => c.account.business.toBase58() === publicKey?.toBase58()
  );

  const totalCampaigns = businessCampaigns.length;
  const totalPayouts = businessCampaigns.reduce((sum, c) => sum + Number(c.account.totalPayouts), 0);
  const totalPayoutAmount = businessCampaigns.reduce(
    (sum, c) => sum + (Number(c.account.totalPayouts) * Number(c.account.payoutAmount)) / 1_000_000,
    0
  );

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
              Please connect your Solana wallet to access the business dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Business Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Campaigns</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {loading ? '...' : totalCampaigns}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {loading ? '...' : totalPayouts}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Payouts</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  ${loading ? '...' : totalPayoutAmount.toFixed(2)}
                </p>
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
                {loading ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Loading campaigns...
                  </p>
                ) : businessCampaigns.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No campaigns yet. Create your first campaign to get started.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businessCampaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.publicKey.toBase58()}
                        campaign={{
                          publicKey: campaign.publicKey.toBase58(),
                          account: {
                            ...campaign.account,
                            payoutAmount: Number(campaign.account.payoutAmount),
                            maxPayouts: Number(campaign.account.maxPayouts),
                            totalPayouts: Number(campaign.account.totalPayouts),
                          },
                        }}
                        showActions={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchCampaigns();
        }}
      />
    </div>
  );
}

