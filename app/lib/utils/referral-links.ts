import { PublicKey } from '@solana/web3.js';

export interface ReferralLinkParams {
  campaignId: string;
  affiliateAddress: string;
  baseUrl?: string;
}

export function generateReferralLink(params: ReferralLinkParams): string {
  const baseUrl = params.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Simple link format: /r/[campaign]/[affiliate]
  const link = `${baseUrl}/r/${params.campaignId}/${params.affiliateAddress}`;
  
  return link;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateQRCodeUrl(text: string): string {
  // Using QR Code API
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    text
  )}`;
}

