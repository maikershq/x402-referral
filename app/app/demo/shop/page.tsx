'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { toast } from 'sonner';

export default function DemoShop() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralInfo, setReferralInfo] = useState<{
    campaign?: string;
    affiliate?: string;
  }>({});

  useEffect(() => {
    // Check for referral info
    const campaign = sessionStorage.getItem('referral_campaign');
    const affiliate = sessionStorage.getItem('referral_affiliate');
    
    if (campaign && affiliate) {
      setReferralInfo({ campaign, affiliate });
      toast.info('Referral link detected! Complete signup to help your referrer.');
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const demoAffiliateWallet = process.env.NEXT_PUBLIC_AFFILIATE_WALLET_ADDRESS || 'demo-affiliate';
      
      const response = await fetch('/api/webhooks/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: referralInfo.campaign || 'demo-campaign',
          affiliate_id: referralInfo.affiliate || demoAffiliateWallet,
          conversion_type: 'signup',
          metadata: {
            email,
            timestamp: Date.now(),
            fingerprint: 'demo-fingerprint',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('🎉 Signup successful!');
        if (referralInfo.affiliate) {
          toast.success(data.demo_mode 
            ? 'Demo mode: Conversion tracked (no actual payout)' 
            : 'Your referrer will receive a payout soon!');
        } else if (data.demo_mode) {
          toast.info('Demo conversion tracked successfully');
        }
        setEmail('');
        sessionStorage.removeItem('referral_campaign');
        sessionStorage.removeItem('referral_affiliate');
        sessionStorage.removeItem('referral_clicked_at');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-500 px-6 py-8 text-white text-center">
              <h1 className="text-3xl font-bold mb-2">Demo Shop</h1>
              <p className="text-blue-100 dark:text-blue-200">
                Sign up now and get exclusive offers
              </p>
            </div>

            {referralInfo.affiliate && (
              <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-400 dark:border-green-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400 dark:text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      You arrived via a referral link! Complete signup to help your referrer
                      earn rewards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@maikers.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up Now'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Features you'll love
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 dark:text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Instant access to premium features</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 dark:text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 dark:text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">No credit card required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            This is a demo shop for testing the referral system. No real signup occurs.
          </p>
        </div>
      </main>
    </div>
  );
}

