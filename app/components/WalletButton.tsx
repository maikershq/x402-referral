'use client';

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <WalletMultiButtonDynamic className="!bg-blue-600 dark:!bg-blue-500 hover:!bg-blue-700 dark:hover:!bg-blue-600 transition-colors" />
  );
}

