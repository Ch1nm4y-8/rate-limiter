import type RateLimiterStrategy from "./RateLimiterStrategy.js";

type WindowRecord = {
  count: number;
  windowStart: number;
};

type FixedWindowCounterStrategyProp = {
  maxRequests?: number;
  windowMs?: number;
};

export default class FixedWindowCounterStrategy implements RateLimiterStrategy {
  private maxRequests: number;
  private windowMs: number;
  private buckets: Map<string, WindowRecord> = new Map();

  constructor({ maxRequests = 5, windowMs = 10000 }: FixedWindowCounterStrategyProp) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(ip);

    if (!bucket || now - bucket.windowStart >= this.windowMs) {
      this.buckets.set(ip, { count: 1, windowStart: now });
      return false;
    }

    if (bucket.count < this.maxRequests) {
      bucket.count += 1;
      return false;
    }

    return true;
  }
}
