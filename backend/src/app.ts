import { randomUUID } from "node:crypto";
import cors from "cors";
import express, { type RequestHandler } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { generatePlan } from "./controllers/planController.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { rateLimit } from "./middleware/rateLimit.js";

const SERVICE_VERSION = "1.0.0";

class DisallowedOriginError extends Error {
  public constructor() {
    super("Origin is not allowed");
    this.name = "DisallowedOriginError";
  }
}

const requestId: RequestHandler = (_request, response, next) => {
  response.setHeader("X-Request-Id", randomUUID());
  next();
};

function corsOptions(): cors.CorsOptions {
  return {
    origin(origin, callback) {
      if (
        !origin ||
        env.NODE_ENV !== "production" ||
        env.allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new DisallowedOriginError());
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-Request-Id"],
    maxAge: 86_400,
  };
}

/** Express application, exported independently for fast integration testing. */
export function createApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(requestId);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "no-referrer" },
    }),
  );
  app.use(cors(corsOptions()));
  app.use(express.json({ limit: "32kb", strict: true }));
  app.get("/", (_request, response) =>
    response.status(200).json({
      service: "occasio-api",
      version: SERVICE_VERSION,
      health: "/api/v1/health",
    }),
  );
  app.get("/health", (_request, response) =>
    response.status(200).json({
      status: "ok",
      service: "occasio-api",
      version: SERVICE_VERSION,
    }),
  );
  app.get("/api/v1/health", (_request, response) =>
    response.status(200).json({
      status: "ok",
      service: "occasio-api",
      version: SERVICE_VERSION,
    }),
  );
  app.post("/api/v1/plans/generate", rateLimit(), generatePlan);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
