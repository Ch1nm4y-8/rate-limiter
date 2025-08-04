import type RateLimiterStrategy from "./RateLimiterStrategy.js";

type TokenBucketStrategyProp = {
  capacity?: number;
  refillAmount?: number;
  refillTimeInMs?: number;
};

export default class TokenBucketStrategy implements RateLimiterStrategy {
  private bucket_capacity: number;
  private refillAmount: number;
  private refillTimeInMs: number;
  private buckets: Map<string, { tokens: number; lastRefill: number }>;

  constructor({ capacity = 5, refillAmount = 3, refillTimeInMs = 10000 }: TokenBucketStrategyProp) {
    this.bucket_capacity = capacity;
    this.refillAmount = refillAmount;
    this.refillTimeInMs = refillTimeInMs;
    this.buckets = new Map();
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(ip);

    if (!bucket) {
      bucket = { tokens: this.bucket_capacity, lastRefill: now };
      this.buckets.set(ip, bucket);
    }

    const elapsed = now - bucket.lastRefill;

    if (elapsed >= this.refillTimeInMs) {
      const refills = Math.floor(elapsed / this.refillTimeInMs);
      bucket.tokens = Math.min(this.bucket_capacity, bucket.tokens + refills * this.refillAmount);
      bucket.lastRefill += refills * this.refillTimeInMs;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return false;
    }

    return true;
  }
}
