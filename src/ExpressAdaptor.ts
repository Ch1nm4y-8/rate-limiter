import type { NextFunction, Request, Response } from "express";
import type RateLimiter from "./services/RateLimiter.js";

export function expressRateLimiter(limiter: RateLimiter) {
  return function (req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || "unknown";

    if (limiter.isRateLimited(ip)) {
      res.status(429).send("Too many requests. Try again Later");
    } else {
      next();
    }
  };
}
