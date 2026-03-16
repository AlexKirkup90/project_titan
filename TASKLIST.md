# Project Titan Tasklist

> This file is the ongoing execution tracker and must be updated every coding session.

## Roadmap Progress

### Phase 1 — Zero-Friction Ingestion Pipeline (Months 1–2)
- [x] Terra webhook ingestion endpoint scaffold (`POST /api/webhooks/terra`)
- [x] Subjective logging API scaffold (`POST /api/logs/subjective`)
- [x] Canonical Episode schema validator and quality checker
- [x] Retry queue + dedupe + dead-letter queue scaffolding
- [x] Medichecks PDF extraction script using `pdfplumber`
- [ ] Persistent database-backed dedupe store (currently in-memory)
- [ ] Durable queueing (currently process-memory queue)
- [ ] Authentication + webhook signature verification
- [ ] Ingestion completeness reporting job (target ≥90%)
- [ ] Duplicate rate reporting job (target <1%)

### Phase 2 — n=1 Vector Engine & Baseline Orchestration (Months 3–4)
- [ ] Provision vector index and define namespaces/metadata strategy
- [ ] Build embedding + upsert pipeline from Episode objects
- [ ] Morning protocol retrieval + generation workflow

### Phase 3 — Reinforcement Learning Loop (Months 5–6)
- [ ] Reward computation cron (t+1 deltas)
- [ ] Action-state policy weighting update loop

### Phase 4 — Autonomous Logistics & Action Layer (Months 7+)
- [ ] Calendar integration and scheduling action execution
- [ ] NL logging interface for RPE/nutrition/workout updates

## Session Log

### 2026-03-16
- Added initial Phase 1 backend scaffolding and validation tooling.
- Added an in-repo ongoing task tracker (this file).
