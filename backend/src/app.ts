import { randomUUID } from "node:crypto";
import cors from "cors";
import express, { type RequestHandler } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { generatePlan } from "./controllers/planController.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { rateLimit } from "./middleware/rateLimit.js";

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
      callback(new Error("Origin is not allowed"));
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
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors(corsOptions()));
  app.use(express.json({ limit: "32kb", strict: true }));
  app.get("/health", (_request, response) =>
    response.status(200).json({ status: "ok", service: "occasio-api" }),
  );
  app.get("/api/v1/health", (_request, response) =>
    response.status(200).json({ status: "ok", service: "occasio-api" }),
  );
  app.post("/api/v1/plans/generate", rateLimit(), generatePlan);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
