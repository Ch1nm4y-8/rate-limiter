import type RateLimiterStrategy from "../RateLimiterStrategy/RateLimiterStrategy.js";
import SlidingWindowLogStrategy from "../RateLimiterStrategy/SlidingWindowLogStrategy.js";

export default class RateLimiter {
  private strategy: RateLimiterStrategy;

  constructor(rateLimiterStrategy: RateLimiterStrategy = new SlidingWindowLogStrategy({})) {
    this.strategy = rateLimiterStrategy;
  }

  isRateLimited(ip: string) {
    return this.strategy.isRateLimited(ip);
  }
}
