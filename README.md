# Occasio — Celebration & Event Planner

Occasio is a GenAI-assisted planning workspace for weddings, milestone birthdays, anniversaries, and community events. It creates a practical planning brief with a budget, date-based timeline, vendor safety checklist, personalized ideas, and risk flags, then lets the user keep working in the existing tactile planning workspace.

## Challenge alignment

- **Smart, contextual assistant:** event type, date, headcount, budget, venue, and access requirements directly shape each plan.
- **Practical output:** every brief contains a balanced allocation, dated milestones, vendor questions, protected contingency, and operational risk flags.
- **Personalized ideas:** Gemini enriches creative ideas and vendor questions when `GEMINI_API_KEY` is configured; the core plan remains transparent and operational without it.
- **Inclusive planning:** step-free access, allergen support, weather backup, and a low-sensory option are part of the input and checklist.

## Architecture

```text
React / Vite client
  └─ POST /api/v1/plans/generate
       └─ Express API
            ├─ Zod boundary validation
            ├─ input-injection guard + normalized prompts
            ├─ deterministic budget, timeline, checklist, and risk engine
            └─ optional Gemini creative enrichment with timeout/circuit breaker
```

The deterministic engine is intentional: important planning facts do not become unavailable or opaque when an LLM is slow, unavailable, or omitted. Returned plans are clearly marked `live` (Gemini-enriched) or `deterministic`.

When the Studio opens, the client sends one low-priority, data-free request to `/api/v1/health` per browser session. This wakes a sleeping deployment before the visitor reaches the plan wizard, without delaying rendering or sending an event brief.

## Local setup

Prerequisites: Node 20+.

```bash
# Terminal 1 — API
cd backend
cp .env.example .env
npm install
npm run dev

# Terminal 2 — client
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend proxies `/api/v1` to `http://127.0.0.1:8787` while developing. Set `GEMINI_API_KEY` in `backend/.env` to enable Gemini enrichment. Do not put that key in the frontend.

## Quality checks

```bash
cd backend && npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
cd frontend && npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

GitHub Actions applies the same gates on `main` and pull requests. See [the architecture and safeguards](docs/ARCHITECTURE.md) for the security, resilience, and scale boundaries.

## Evaluation-ready evidence

Occasio is designed for the celebration and event-planning vertical. The assistant uses the event type, date, guest count, budget, venue, access settings, and optional planning priorities to produce a structured, actionable brief. It never delegates budget arithmetic, time-critical milestones, or safety safeguards to a generative model.

- **Code quality:** strict TypeScript, small domain-focused modules, Prettier, ESLint, documented design boundaries, and CI checks on every change to `main`.
- **Security and privacy:** schema-strict request and response boundaries; prompt-injection screening; Helmet, CORS allow-listing, request-size limits, request IDs, and rate limiting. Plans persist only in the visitor's browser; API briefs are not stored.
- **Efficiency and resilience:** bounded LRU/TTL caching, a timeout and circuit breaker around optional Gemini enrichment, plus a fully deterministic fallback.
- **Testing:** API integration, unit, resilience, state, client-contract, interaction, and accessibility tests with enforced coverage thresholds.
- **Accessibility:** semantic controls, keyboard-operable radio groups and dialogs, focus containment/restoration, visible focus states, live notifications, and a concise privacy cue beside free-text planning priorities.

### Submission checklist

Before submitting, confirm the repository is **public**, `main` is the only branch, and the repository stays below the 10 MB limit. This checkout currently has only `main`; `git count-objects -vH` reports the tracked Git database size. Do not commit `.env` files, build output, coverage reports, or dependencies—these are excluded by the repository ignore rules.

After a production deploy, use the plan wizard once with a real future date and verify the created plan appears in the workspace. The generated brief should show either a live AI-enriched plan or a clearly labelled resilient deterministic plan, never an unavailable or opaque result.

## Deployment

`render.yaml` provisions the API from `backend/`; configure `ALLOWED_ORIGINS` to the public Vercel URL and add `GEMINI_API_KEY` only in Render's encrypted environment settings. Deploy the Vite frontend from `frontend/`, where `frontend/vercel.json` defines its Vite build and SPA fallback. Set `VITE_API_BASE_URL=https://<your-render-service>/api/v1` as a Vercel production environment variable. The Vercel project is linked to this repository, so pushes to `main` create deployments automatically.

## Assumptions

- This project is a planning assistant, not a booking marketplace. It provides vendor-ready checklists rather than making purchases or reservations.
- Plans are saved locally in the browser workspace; the API is intentionally stateless and does not retain event details.
- Currency is USD in the starter UI; calculations use decimal-safe rounded amounts and preserve the total budget exactly.
