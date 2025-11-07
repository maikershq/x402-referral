// Fraud detection logic

export interface FraudCheckResult {
  score: number; // 0-100, higher = more suspicious
  reasons: string[];
  passed: boolean;
}

export async function checkConversion(data: {
  ip: string;
  userAgent: string;
  fingerprint: string;
  affiliateId: string;
  campaignId: string;
}): Promise<FraudCheckResult> {
  const reasons: string[] = [];
  let score = 0;

  // TODO: Implement fraud checks:
  // - IP/ASN risk scoring
  // - Velocity limits (conversions per time window)
  // - Device fingerprint dedupe
  // - User-agent anomalies
  // - Geo-location checks

  return {
    score,
    reasons,
    passed: score < 70,
  };
}

