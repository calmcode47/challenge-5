import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Clears ephemeral limiter state between isolated test cases. */
export function resetRateLimitBucketsForTesting(): void {
  buckets.clear();
}

/** Lightweight per-IP guard suitable for a stateless demo service. Use a managed limiter in multi-instance production. */
export function rateLimit(limit = 20, windowMs = 60_000) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = `${request.ip ?? "unknown"}:${request.path}`;
    const previous = buckets.get(key);
    const bucket =
      !previous || previous.resetAt <= now
        ? { count: 0, resetAt: now + windowMs }
        : previous;
    bucket.count += 1;
    buckets.set(key, bucket);
    response.setHeader("RateLimit-Limit", String(limit));
    response.setHeader(
      "RateLimit-Remaining",
      String(Math.max(0, limit - bucket.count)),
    );
    response.setHeader(
      "RateLimit-Reset",
      String(Math.ceil(bucket.resetAt / 1000)),
    );
    if (bucket.count > limit) {
      response.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Please pause briefly before creating another plan.",
        },
      });
      return;
    }
    next();
  };
}
