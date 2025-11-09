'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  return (
    <WalletMultiButton className="!bg-blue-600 dark:!bg-blue-500 hover:!bg-blue-700 dark:hover:!bg-blue-600 transition-colors" />
  );
}

