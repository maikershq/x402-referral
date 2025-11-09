'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from './WalletButton';
import { ThemeToggle } from './ThemeToggle';

export function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">X402 Referral</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/business/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/business')
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                Business
              </Link>
              <Link
                href="/affiliate/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/affiliate')
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                Affiliate
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

