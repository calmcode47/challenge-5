# Occasio — Celebration & Event Planner

[![Quality gates](https://github.com/calmcode47/challenge-5/actions/workflows/quality.yml/badge.svg)](https://github.com/calmcode47/challenge-5/actions/workflows/quality.yml)

Occasio is a GenAI-assisted planning workspace for weddings, milestone birthdays, anniversaries, and community events. It creates a practical planning brief with a budget, date-based timeline, vendor safety checklist, personalized ideas, and risk flags, then lets the user keep working in the existing tactile planning workspace.

**Live application:** [Vercel frontend](https://frontend-five-ruby-77.vercel.app) · [Render API](https://occasio-api.onrender.com/) · [API health](https://occasio-api.onrender.com/api/v1/health)

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

## Example plan

For a community supper on `2027-10-12` for `80` guests with a `$12,000` budget at `Riverside Pavilion`, plus step-free, allergen-aware, and weather-backup requirements, Occasio returns:

- a six-envelope budget that preserves the full total, including protected contingency;
- dated milestones that never start in the past, even for short-notice events;
- vendor questions for insurance, access, allergens, and a weather pivot; and
- risk flags prioritising food, safety, and core logistics when the per-guest budget is lean.

## API example

`POST /api/v1/plans/generate`

```json
{
  "title": "Neighbourhood Harvest Supper",
  "eventType": "community",
  "date": "2027-10-12",
  "guestCount": 80,
  "budget": 12000,
  "venue": "Riverside Pavilion",
  "notes": "Welcome local makers and use low-waste serviceware.",
  "accessibility": {
    "stepFreeAccess": true,
    "allergenAware": true,
    "weatherBackup": true,
    "lowSensoryOption": false
  }
}
```

```json
{
  "data": {
    "aiMode": "deterministic",
    "budgetAllocation": [
      { "category": "Venue & rentals", "percent": 22, "amount": 2640 },
      { "category": "Food & beverage", "percent": 32, "amount": 3840 }
    ],
    "timeline": [{ "phase": "Foundation", "due": "2027-04-15" }],
    "riskFlags": [
      "Hold at least 12% of the budget as contingency until final vendor balances are confirmed."
    ]
  }
}
```

The complete response also includes vendor safeguards and personalized ideas. `aiMode` becomes `live` only when validated Gemini enrichment is available; all operational fields remain deterministic.

## Repository and delivery facts

- The repository is public and contains one branch: `main`.
- The tracked Git database is below 1 MB, well under the 10 MB challenge limit.
- CI runs formatting, linting, strict type checks, coverage-enforced tests, production builds, and production dependency audits for both applications.
- The project is available under the [MIT License](LICENSE).

## Deployment

`render.yaml` provisions the API from `backend/`; configure `ALLOWED_ORIGINS` to the public Vercel URL and add `GEMINI_API_KEY` only in Render's encrypted environment settings. Deploy the Vite frontend from `frontend/`, where `frontend/vercel.json` defines its Vite build and SPA fallback. Set `VITE_API_BASE_URL=https://<your-render-service>/api/v1` as a Vercel production environment variable. The Vercel project is linked to this repository, so pushes to `main` create deployments automatically.

## Assumptions

- This project is a planning assistant, not a booking marketplace. It provides vendor-ready checklists rather than making purchases or reservations.
- Plans are saved locally in the browser workspace; the API is intentionally stateless and does not retain event details.
- Currency is USD in the starter UI; calculations use decimal-safe rounded amounts and preserve the total budget exactly.
