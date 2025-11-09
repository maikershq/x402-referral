'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { NavBar } from '@/components/NavBar';
import { CampaignCard } from '@/components/CampaignCard';
import { ReferralLinkGenerator } from '@/components/ReferralLinkGenerator';
import { useState, useEffect } from 'react';
import { getProgram, getAllCampaigns } from '@/lib/solana/anchor-client';
import { PublicKey } from '@solana/web3.js';

interface CampaignData {
  publicKey: PublicKey;
  account: any;
}

interface AffiliateStats {
  total_earnings: number;
  total_conversions: number;
  total_payouts: number;
}

export default function AffiliateDashboard() {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AffiliateStats>({
    total_earnings: 0,
    total_conversions: 0,
    total_payouts: 0,
  });
  const [selectedCampaign, setSelectedCampaign] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchStats = async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/analytics/stats?affiliate_id=${publicKey.toBase58()}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats({
          total_earnings: data.total_earnings || 0,
          total_conversions: data.total_conversions || 0,
          total_payouts: data.total_payouts || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCampaigns = async () => {
    if (!connected || !wallet) return;

    try {
      setLoading(true);
      const program = getProgram(connection, wallet.adapter as any);
      const allCampaigns = await getAllCampaigns(program);
      
      const activeCampaigns = allCampaigns.filter(
        (c: any) => c.account.status.active
      );
      
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [connected, publicKey]);

  const activeCampaigns = campaigns.filter(
    (c: any) => c.account.status.active
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
              Please connect your Solana wallet to access the affiliate dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Affiliate Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Campaigns</h3>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {loading ? '...' : activeCampaigns.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rewards</h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${stats.total_earnings.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Conversions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_conversions}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Available Campaigns</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Loading campaigns...
                  </p>
                ) : activeCampaigns.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No campaigns available. Check back later or create a campaign as a business.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCampaigns.map((campaign) => (
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
                        onGenerateLink={() => setSelectedCampaign({
                          id: campaign.publicKey.toBase58(),
                          name: campaign.account.name,
                        })}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedCampaign && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Referral Link for {selectedCampaign.name}
                  </h2>
                </div>
                <div className="p-6">
                  <ReferralLinkGenerator
                    campaignId={selectedCampaign.id}
                    campaignName={selectedCampaign.name}
                    affiliateAddress={publicKey?.toBase58() || ''}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

