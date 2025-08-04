import type RateLimiterStrategy from "./RateLimiterStrategy.js";

type SlidingWindowLogStrategyProp = {
  maxRequests?: number;
  windowMs?: number;
};

export default class SlidingWindowLogStrategy implements RateLimiterStrategy {
  private ipToRequestMapping: Map<string, number[]>; // number - storing timestamp
  private maxRequests: number;
  private windowMs: number;

  constructor({ maxRequests = 5, windowMs = 10000 }: SlidingWindowLogStrategyProp) {
    this.ipToRequestMapping = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(ip: string) {
    const now = Date.now();
    const requestsQueue = this.ipToRequestMapping.get(ip) || [];

    // Filter out stale requests
    while (requestsQueue[0] && now - requestsQueue[0] >= this.windowMs) {
      requestsQueue.shift();
    }

    if (requestsQueue.length >= this.maxRequests) {
      return true;
    }

    requestsQueue.push(now);
    this.ipToRequestMapping.set(ip, requestsQueue);
    return false;
  }
}
