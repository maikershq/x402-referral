'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ReferralLinkHandler() {
  const params = useParams();
  const router = useRouter();
  const { campaign, affiliate } = params;

  useEffect(() => {
    // Store referral info in session/cookie
    if (campaign && affiliate) {
      sessionStorage.setItem('referral_campaign', campaign as string);
      sessionStorage.setItem('referral_affiliate', affiliate as string);
      sessionStorage.setItem('referral_clicked_at', Date.now().toString());
    }

    // Redirect to demo shop
    router.push('/demo/shop');
  }, [campaign, affiliate, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

