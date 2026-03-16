#!/usr/bin/env python3
"""Extract biomarker values from Medichecks PDFs into typed JSON.

Usage:
  python scripts/extract_medichecks.py input.pdf --output data/biomarkers.json
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict
from datetime import datetime, UTC

import pdfplumber


@dataclass
class BiomarkerOutput:
    source_file: str
    extracted_at: str
    ferritin_ugL: float | None
    vitamin_d_nmolL: float | None
    hba1c_mmol_mol: float | None


PATTERNS: dict[str, re.Pattern[str]] = {
    "ferritin_ugL": re.compile(r"ferritin\s+([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
    "vitamin_d_nmolL": re.compile(r"vitamin\s*d\s+([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
    "hba1c_mmol_mol": re.compile(r"hba1c\s+([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
}


def extract_text(pdf_path: str) -> str:
    pages: list[str] = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return "\n".join(pages)


def parse_biomarkers(text: str, source_file: str) -> BiomarkerOutput:
    values: dict[str, float | None] = {k: None for k in PATTERNS}
    for key, pattern in PATTERNS.items():
        match = pattern.search(text)
        values[key] = float(match.group(1)) if match else None

    return BiomarkerOutput(
        source_file=source_file,
        extracted_at=datetime.now(UTC).isoformat(),
        ferritin_ugL=values["ferritin_ugL"],
        vitamin_d_nmolL=values["vitamin_d_nmolL"],
        hba1c_mmol_mol=values["hba1c_mmol_mol"],
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_pdf")
    parser.add_argument("--output", default="data/medichecks_biomarkers.json")
    args = parser.parse_args()

    text = extract_text(args.input_pdf)
    output = parse_biomarkers(text, args.input_pdf)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(asdict(output), f, indent=2)

    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
