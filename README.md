# Project Titan: n=1 Autonomous Coaching Agent

Project Titan is a predictive, autonomous health orchestration engine designed to prove an n=1 physiological digital twin, then scale to closed beta and enterprise acquisition readiness.

## Executive Summary

Legacy coaching platforms are mostly rules-based and static. Titan is designed as a continuously learning system that:

- Ingests high-fidelity biological and behavioral data (wearables, biomarkers, nutrition, subjective logs).
- Standardizes each day into a strict Episode schema.
- Embeds Episodes into a vector database for semantic retrieval of physiologically similar days.
- Uses retrieval-augmented generation (RAG) to prescribe daily protocols.
- Updates recommendations over time through a reward loop based on biological outcomes.

### Acquisition Thesis

- **By Q4 2026:** Prove n=1 predictive efficacy and autonomous protocol reliability.
- **By 2027:** Scale to a closed-beta cohort with reproducible outcomes.
- **By 2030:** Position for enterprise acquisition with proprietary longitudinal dataset, measurable efficacy, and enterprise-grade integrations.

---

## Current Build Status

We are actively implementing **Phase 1: Zero-Friction Ingestion Pipeline**.

Track ongoing progress in [`TASKLIST.md`](./TASKLIST.md). This file is updated each coding session to show completed vs pending roadmap work.

---

## Enterprise-Grade Technology Stack

- **Frontend:** React + TypeScript (strict typing for all biological payloads).
- **AI/Reasoning Engine:** Codex agentic orchestration (prompt chaining, unstructured parsing, tool execution).
- **Vector Database:** Pinecone or Weaviate using HNSW-based similarity search.
- **Data Ingestion Layer:**
  - Terra API webhooks for Oura/Whoop and Apple Health data paths.
  - OCR/text extraction pipeline for Medichecks PDFs using `pdfplumber`.
- **Backend:** Node.js + Express for secure ingest endpoints, orchestration, and API routing.
- **Operational Storage:** Postgres for users, integrations, logs, and auditing.
- **Object Storage:** S3/GCS for raw documents and processing artifacts.

---

## Core IP: Episode Schema

Titan’s core defensibility is in standardizing each 24-hour cycle into a canonical JSON Episode.

```json
{
  "episode_id": "2026-03-16_user_01",
  "block_a_state": {
    "oura_readiness": 72,
    "oura_hrv_ms": 45,
    "oura_sleep_duration_mins": 375,
    "medichecks_latest_ferritin_ugL": 45,
    "calendar_load_hours": 6
  },
  "block_b_action": {
    "prescribed_training": "Morpheus Zone 2, 45 mins",
    "target_protein_g": 140,
    "supplementation": ["Thorne Multi", "Creatine 5g"]
  },
  "block_c_reward": {
    "t_plus_1_hrv_delta": 5.2,
    "t_plus_1_rpe": 4,
    "cronometer_compliance_score": 0.95
  },
  "metadata": {
    "tags": ["traveling", "post_race_day", "high_stress"]
  }
}
```

### Why this matters

Embedding the full Episode enables similarity search over physiological context (not brittle SQL-only conditions), making recommendations state-aware and adaptive.

---

## Phase 1 Implementation (in this repo)

### API Endpoints

- `GET /health`
- `POST /api/webhooks/terra`
  - Validates Terra payloads.
  - Applies in-memory deduplication by event ID.
  - Enqueues events through retry queue.
- `POST /api/logs/subjective`
  - Captures daily RPE, friction, and notes.
- `GET /api/internal/dlq`
  - Returns dead-letter queue records.
- `GET /api/internal/metrics`
  - Returns queue/de-dupe/DLQ counters.

### Tooling

- Canonical Episode schema + quality checks:
  - `src/schemas/episode.ts`
  - `npm run validate:episode -- data/sample_episode.json`
- PDF extraction script:
  - `python scripts/extract_medichecks.py input.pdf --output data/medichecks_biomarkers.json`

---

## Local Development

```bash
npm install
npm run dev
```

Type-check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

---

## Target Production Architecture (v1)

1. **Ingestion Service (Node/Express)**
   - Terra webhooks, subjective logs endpoint, file ingest triggers.
2. **Normalization + Episode Builder**
   - Converts raw data streams into canonical Episode JSON.
3. **Embedding + Retrieval Service**
   - Generates vectors and stores/query episodes in Pinecone/Weaviate.
4. **Protocol Generator (RAG)**
   - Retrieves similar historical episodes and proposes daily protocol.
5. **Reward Engine (scheduled evaluator)**
   - Computes next-day deltas and updates reward fields.
6. **Action Layer**
   - Calendar scheduling and operational execution via function calls.
7. **Frontend App (React/TS)**
   - Daily plan, explainability, adherence logging, and natural language input.

### Non-Functional Requirements

- Idempotent ingestion and deduplication for all webhook events.
- End-to-end observability (structured logs, traces, alerts).
- Data lineage for each Episode field (source + timestamp).
- Security-by-default: encryption in transit/at rest, least-privilege access.

---

## Execution Protocols & Phased Buildout

## Phase 1 (Months 1–2): Zero-Friction Ingestion Pipeline

**Objective:** Build the automated data catch-net.

- Deploy Node/Express webhook endpoints for Terra streams.
- Integrate Terra mobile data path for Apple Health.
- Build PDF extraction utility with `pdfplumber` and typed biomarker JSON output.
- Ship subjective logging endpoint (RPE + psychological friction).
- Add validation, retries, dedupe, and dead-letter handling.

**Exit Criteria**
- ≥90% daily ingestion completeness (n=1).
- <1% duplicate event rate.
- Required Episode fields validate or fail with explicit null reason.

## Phase 2 (Months 3–4): n=1 Vector Engine & Baseline Orchestration

**Objective:** Establish baseline retrieval-driven protocol generation.

- Provision serverless vector index (Pinecone/Weaviate).
- Implement embedding pipeline from canonical Episodes.
- Morning protocol job queries readiness + retrieves top similar days.
- Generate protocol with sports science heuristics + historical outcomes.
- Provide explainability and safe fallback behavior.

**Exit Criteria**
- >95% autonomous morning protocol generation.
- Retrieval latency within production target.
- Recommendations pass safety/coherence review.

## Phase 3 (Months 5–6): Reinforcement Learning Loop (Moat)

**Objective:** Implement self-correcting policy.

- Run daily reward cron (e.g., 04:00 local).
- Compare prior day action vs next-morning state.
- Update `block_c_reward` with biological deltas.
- Prioritize actions associated with positive historical rewards.
- Penalize action-state patterns correlated with negative outcomes.

**Exit Criteria**
- Rewards computed for >90% eligible days.
- Policy behavior demonstrably adapts over time.
- Positive trend vs baseline heuristics.

## Phase 4 (Months 7+): Autonomous Logistics & Action Layer

**Objective:** Move from recommendations to execution.

- Add secure function-calling for Google Calendar/Calendly.
- Auto-place training blocks in optimal physiological windows.
- Build NL interface for workout/nutrition/RPE capture.
- Keep human-in-the-loop confirmation and override controls.

**Exit Criteria**
- High schedule placement success rate.
- Declining override rate with maintained trust/safety.
- No high-severity safety incidents.
