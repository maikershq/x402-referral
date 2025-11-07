'use client';

import { shortenAddress } from '@/lib/utils/referral-links';

interface Campaign {
  publicKey: string;
  account: {
    name: string;
    merchant: string;
    payoutAmount: number;
    maxPayouts: number;
    totalPayouts: number;
    status: any;
  };
}

interface CampaignCardProps {
  campaign: Campaign;
  onGenerateLink?: () => void;
  showActions?: boolean;
}

export function CampaignCard({ campaign, onGenerateLink, showActions = true }: CampaignCardProps) {
  const { account } = campaign;
  const payoutAmountUSDC = account.payoutAmount / 1_000_000;
  const progress = (account.totalPayouts / account.maxPayouts) * 100;

  const getStatusColor = (status: any) => {
    if (status.active) return 'bg-green-100 text-green-800';
    if (status.paused) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: any) => {
    if (status.active) return 'Active';
    if (status.paused) return 'Paused';
    return 'Ended';
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              by {shortenAddress(account.merchant)}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              account.status
            )}`}
          >
            {getStatusText(account.status)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payout per conversion:</span>
            <span className="font-semibold text-gray-900">${payoutAmountUSDC.toFixed(2)}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress:</span>
              <span className="font-semibold text-gray-900">
                {account.totalPayouts}/{account.maxPayouts}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {showActions && onGenerateLink && (
          <div className="mt-6">
            <button
              onClick={onGenerateLink}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Generate Referral Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

