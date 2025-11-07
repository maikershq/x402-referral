'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  generateReferralLink,
  copyToClipboard,
  generateQRCodeUrl,
} from '@/lib/utils/referral-links';

interface ReferralLinkGeneratorProps {
  campaignId: string;
  campaignName: string;
  affiliateAddress: string;
}

export function ReferralLinkGenerator({
  campaignId,
  campaignName,
  affiliateAddress,
}: ReferralLinkGeneratorProps) {
  const [showQR, setShowQR] = useState(false);

  const referralLink = generateReferralLink({
    campaignId,
    affiliateAddress,
  });

  const handleCopy = async () => {
    try {
      await copyToClipboard(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${campaignName}`,
          text: `Check out this campaign: ${campaignName}`,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Share
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {showQR ? 'Hide' : 'Show'} QR Code
        </button>
      </div>

      {showQR && (
        <div className="flex justify-center pt-2">
          <img
            src={generateQRCodeUrl(referralLink)}
            alt="QR Code"
            className="border border-gray-200 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

