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

- The deterministic planner calculates budget allocations, dated milestones, vendor safeguards, and risk flags from the submitted event context. Optional priorities can safely select an additional practical idea (tradition, family, or low-waste focus) without echoing free text. Short-notice plans clamp milestone due dates to today so no task is already overdue when the plan is created.
- Gemini is optional enrichment only. Its response is schema-validated; a timeout, circuit breaker, and deterministic fallback keep the feature usable when the provider is unavailable.
- The request boundary uses Zod validation, normalizes user notes, and rejects common attempts to treat user-provided text as system instructions.
- The client independently validates the complete plan response before it reaches the workspace, so malformed or unexpected network data is not persisted or rendered.
- HTTP safeguards include Helmet, a no-referrer policy, explicit production CORS allow-listing, a 32 KB JSON limit, request IDs, rate limiting, and consistent structured error responses.
- The request schema is strict, so unknown fields are rejected rather than silently ignored. The browser uses the corresponding input limits before sending a brief.
- The in-memory cache and limiter are deliberately bounded. The local vault also caps stored plans and accepts only the approved static image host during imports. For a horizontally scaled production system, replace the server-side cache and limiter with shared managed services.

## Verification

Both packages use formatting, lint, strict type checks, tests with enforced coverage thresholds, production builds, and a production-dependency audit. The GitHub Actions workflow runs those checks for `main` and pull requests. The backend Docker context excludes local dependencies, build output, logs, and environment files so deployed builds stay lean and do not accidentally package local secrets.
