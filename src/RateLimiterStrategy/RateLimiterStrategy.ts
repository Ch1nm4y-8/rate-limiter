export default interface RateLimiterStrategy {
  isRateLimited: (ip: string) => boolean;
}
