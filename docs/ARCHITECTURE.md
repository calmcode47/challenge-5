# Architecture and safeguards

Occasio is a stateless planning API behind a browser-first workspace. Event plans stay in the browser unless a visitor explicitly submits a brief to create a plan; the API does not persist those briefs.

```text
Vite client ── POST /api/v1/plans/generate ──> Express API
     │                                              │
     │ local plan vault                             ├─ schema and prompt-safety boundary
     │                                              ├─ deterministic planning engine
     └─ one session health wake-up ──────────────── └─ optional Gemini wording enrichment
                                                           │
                                              timeout + circuit breaker + validated response
```

## Design choices

- The deterministic planner calculates budget allocations, dated milestones, vendor safeguards, and risk flags from the submitted event context. It is always available and makes the primary result explainable.
- Gemini is optional enrichment only. Its response is schema-validated; a timeout, circuit breaker, and deterministic fallback keep the feature usable when the provider is unavailable.
- The request boundary uses Zod validation, normalizes user notes, and rejects common attempts to treat user-provided text as system instructions.
- HTTP safeguards include Helmet, explicit production CORS allow-listing, a 32 KB JSON limit, request IDs, rate limiting, and consistent structured error responses.
- The in-memory cache and limiter are deliberately bounded. For a horizontally scaled production system, replace them with a shared cache and managed rate limiter.

## Verification

Both packages use formatting, lint, strict type checks, tests with enforced coverage thresholds, production builds, and a production-dependency audit. The GitHub Actions workflow runs those checks for `main` and pull requests.
