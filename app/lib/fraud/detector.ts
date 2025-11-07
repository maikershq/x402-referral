// Fraud detection logic

export interface FraudCheckResult {
  score: number; // 0-100, higher = more suspicious
  reasons: string[];
  passed: boolean;
}

interface ConversionHistory {
  ip: string;
  timestamp: number;
}

// In-memory store for demo (use Redis in production)
const conversionHistory = new Map<string, ConversionHistory[]>();
const fingerprintCache = new Set<string>();

export async function checkConversion(data: {
  ip: string;
  userAgent: string;
  fingerprint: string;
  affiliateId: string;
  campaignId: string;
}): Promise<FraudCheckResult> {
  const reasons: string[] = [];
  let score = 0;

  // 1. Check for empty/invalid data
  if (!data.ip || !data.userAgent || !data.fingerprint) {
    score += 50;
    reasons.push('Missing required data');
  }

  // 2. Check for suspicious user agents
  const suspiciousAgents = ['bot', 'crawler', 'spider', 'scraper'];
  if (
    suspiciousAgents.some((agent) => data.userAgent.toLowerCase().includes(agent))
  ) {
    score += 40;
    reasons.push('Suspicious user agent detected');
  }

  // 3. Check for duplicate fingerprints
  const fingerprintKey = `${data.campaignId}:${data.fingerprint}`;
  if (fingerprintCache.has(fingerprintKey)) {
    score += 60;
    reasons.push('Duplicate fingerprint detected');
  } else {
    fingerprintCache.add(fingerprintKey);
  }

  // 4. Velocity check - max 5 conversions per IP per hour
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const ipKey = `${data.campaignId}:${data.ip}`;
  
  const history = conversionHistory.get(ipKey) || [];
  const recentConversions = history.filter((h) => h.timestamp > oneHourAgo);
  
  if (recentConversions.length >= 5) {
    score += 80;
    reasons.push('Too many conversions from this IP');
  }
  
  // Update history
  history.push({ ip: data.ip, timestamp: now });
  conversionHistory.set(ipKey, history);

  // 5. Check for localhost/private IPs
  if (
    data.ip === '127.0.0.1' ||
    data.ip === 'localhost' ||
    data.ip.startsWith('192.168.') ||
    data.ip.startsWith('10.')
  ) {
    // Allow for demo, but flag it
    reasons.push('Local/private IP detected (allowed for demo)');
  }

  // Clean up old history entries (older than 24 hours)
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  for (const [key, value] of conversionHistory.entries()) {
    const filtered = value.filter((h) => h.timestamp > oneDayAgo);
    if (filtered.length === 0) {
      conversionHistory.delete(key);
    } else {
      conversionHistory.set(key, filtered);
    }
  }

  return {
    score,
    reasons,
    passed: score < 70, // Threshold: 70 points
  };
}

export function clearFraudCache() {
  conversionHistory.clear();
  fingerprintCache.clear();
}

