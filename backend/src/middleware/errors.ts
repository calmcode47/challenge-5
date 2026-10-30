import type { ErrorRequestHandler, RequestHandler } from "express";
import { z, ZodError } from "zod";

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({
    error: { code: "NOT_FOUND", message: "That endpoint does not exist." },
  });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  const requestId = response.getHeader("X-Request-Id");
  if (error instanceof Error && error.name === "DisallowedOriginError") {
    response.status(403).json({
      error: {
        code: "ORIGIN_NOT_ALLOWED",
        message:
          "This browser origin is not permitted to use the planning API.",
        requestId,
      },
    });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "INVALID_INPUT",
        message: "Please check the submitted event details.",
        details: z.flattenError(error),
        requestId,
      },
    });
    return;
  }
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Request body must be valid JSON.",
        requestId,
      },
    });
    return;
  }
  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "We could not create that plan. Please try again.",
      requestId,
    },
  });
};
