import type RateLimiterStrategy from "./RateLimiterStrategy.js";

type LeakyBucketStrategyProp = {
  capacity?: number;
  leakIntervalMs?: number;
};

export default class LeakyBucketStrategy implements RateLimiterStrategy {
  private capacity: number;
  private leakIntervalMs: number;
  private buckets: Map<string, { lastLeakTime: number; queued: number }> = new Map();

  constructor({ capacity = 5, leakIntervalMs = 2000 }: LeakyBucketStrategyProp) {
    this.capacity = capacity;
    this.leakIntervalMs = leakIntervalMs;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(ip);

    if (!bucket) {
      bucket = { lastLeakTime: now, queued: 0 };
      this.buckets.set(ip, bucket);
    }

    const elapsed = now - bucket.lastLeakTime;
    const leaked = Math.floor(elapsed / this.leakIntervalMs);
    if (leaked > 0) {
      bucket.queued = Math.max(0, bucket.queued - leaked);
      bucket.lastLeakTime += leaked * this.leakIntervalMs;
    }

    if (bucket.queued < this.capacity) {
      bucket.queued += 1;
      return false;
    }

    return true;
  }
}
