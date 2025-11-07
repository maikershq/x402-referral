'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from './WalletButton';

export function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">X402 Referral</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/merchant/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/merchant')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Merchant
              </Link>
              <Link
                href="/affiliate/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/affiliate')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Affiliate
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

