#!/usr/bin/env python3
"""
fetch_report.py

Fetch the vulnerability report from an already-completed, manually-triggered
Prisma scan workflow run in GitHub Actions.

Scope (matches 01_Fetch_Report_From_Completed_Run.ipynb exactly):
- Does NOT trigger the workflow -- you trigger it manually in GitHub
- Does NOT upload/search Artifactory -- the report only ever lives as a
  GitHub Actions build artifact
- Only job: find the completed run, download its artifact, parse the report,
  output JSON

Usage:
    export GITHUB_TOKEN=...
    export GITHUB_REPO=org/repo
    export GITHUB_WORKFLOW_FILE=prisma-scan.yml
    export PRISMA_ARTIFACT_NAME=prisma-scan-report

    python fetch_report.py                # fetches the latest completed+successful run
    python fetch_report.py --run-id 12345 # fetches a specific run

Without GITHUB_TOKEN set, runs in DRY-RUN mode against bundled demo data so you
can verify the script works before wiring up real credentials.
"""
import os
import io
import sys
import json
import argparse
import zipfile
import logging
import dataclasses
from dataclasses import dataclass
from typing import Optional

import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("fetch-report")

GITHUB_API = "https://api.github.com"

# ============================================================
# Configuration (env-driven)
# ============================================================
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPO = os.environ.get("GITHUB_REPO", "org/repo")
GITHUB_WORKFLOW_FILE = os.environ.get("GITHUB_WORKFLOW_FILE", "prisma-scan.yml")
ARTIFACT_NAME_HINT = os.environ.get("PRISMA_ARTIFACT_NAME", "prisma-scan-report")


def _gh_headers() -> dict:
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


# ============================================================
# Errors
# ============================================================
class RunNotFoundError(RuntimeError):
    pass


class RunNotSuccessfulError(RuntimeError):
    pass


# ============================================================
# Phase 1 -- find the run
# ============================================================
def find_run(run_id: Optional[int] = None) -> dict:
    """If run_id is given, fetch that run directly. Otherwise, find the most recent
    completed run that actually succeeded -- deliberately refuses to return a failed
    run's artifact, since there's nothing usable in it."""
    if not GITHUB_TOKEN:
        log.info("[DRY-RUN] Would look up %s",
                  f"run_id={run_id}" if run_id else "latest completed run")
        return {"id": run_id or 0, "status": "completed", "conclusion": "success", "dry_run": True}

    if run_id is not None:
        url = f"{GITHUB_API}/repos/{GITHUB_REPO}/actions/runs/{run_id}"
        resp = requests.get(url, headers=_gh_headers(), timeout=30)
        resp.raise_for_status()
        run = resp.json()
    else:
        url = f"{GITHUB_API}/repos/{GITHUB_REPO}/actions/workflows/{GITHUB_WORKFLOW_FILE}/runs"
        resp = requests.get(url, headers=_gh_headers(),
                             params={"status": "completed", "per_page": 5}, timeout=30)
        resp.raise_for_status()
        runs = resp.json().get("workflow_runs", [])
        if not runs:
            raise RunNotFoundError(
                f"No completed runs found for {GITHUB_WORKFLOW_FILE}. "
                f"Has it been triggered manually yet?"
            )
        successful = [r for r in runs if r["conclusion"] == "success"]
        if not successful:
            most_recent = runs[0]
            raise RunNotSuccessfulError(
                f"Most recent completed run (id={most_recent['id']}) concluded as "
                f"'{most_recent['conclusion']}', not 'success' -- no usable report to fetch. "
                f"Trigger the workflow again, or pass a specific successful run_id."
            )
        run = successful[0]

    log.info("Using run id=%s status=%s conclusion=%s", run["id"], run["status"], run["conclusion"])
    return run


# ============================================================
# Phase 2 -- download the artifact
# ============================================================
def list_artifacts(run_id: int) -> list[dict]:
    if not GITHUB_TOKEN:
        log.info("[DRY-RUN] Would list artifacts for run_id=%s", run_id)
        return [{"id": 0, "name": ARTIFACT_NAME_HINT}]
    url = f"{GITHUB_API}/repos/{GITHUB_REPO}/actions/runs/{run_id}/artifacts"
    resp = requests.get(url, headers=_gh_headers(), timeout=30)
    resp.raise_for_status()
    return resp.json().get("artifacts", [])


def download_artifact_zip(artifact_id: int) -> Optional[bytes]:
    if not GITHUB_TOKEN:
        log.info("[DRY-RUN] Would download artifact_id=%s -- using bundled demo report instead", artifact_id)
        return None
    url = f"{GITHUB_API}/repos/{GITHUB_REPO}/actions/artifacts/{artifact_id}/zip"
    resp = requests.get(url, headers=_gh_headers(), timeout=60)
    resp.raise_for_status()
    return resp.content


def extract_json_report(zip_bytes: bytes) -> dict:
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        json_names = [n for n in zf.namelist() if n.endswith(".json")]
        if not json_names:
            raise FileNotFoundError(f"No .json file in artifact. Contents: {zf.namelist()}")
        with zf.open(json_names[0]) as f:
            return json.load(f)


# ============================================================
# Phase 3 -- parse the report
# ============================================================
SEVERITY_ORDER = {"critical": 4, "high": 3, "medium": 2, "low": 1, "unimportant": 0}


@dataclass
class Vulnerability:
    cve_id: str
    severity: str
    package_name: str
    package_version: str
    fix_version: Optional[str]
    description: str

    @property
    def rank(self) -> int:
        return SEVERITY_ORDER.get(self.severity.lower(), 0)


def parse_prisma_report(report: dict) -> list[Vulnerability]:
    vulns = []
    for result in report.get("results", []):
        for v in result.get("vulnerabilities", []) or []:
            vulns.append(Vulnerability(
                cve_id=v.get("id", "UNKNOWN"),
                severity=v.get("severity", "unimportant"),
                package_name=v.get("packageName", "unknown"),
                package_version=v.get("packageVersion", "unknown"),
                fix_version=v.get("fixDate") or v.get("status"),
                description=v.get("description", ""),
            ))
    vulns.sort(key=lambda v: v.rank, reverse=True)
    return vulns


DEMO_PRISMA_REPORT = {
    "results": [{
        "name": "payments-api:1.4.2",
        "vulnerabilities": [
            {"id": "CVE-2024-6119", "severity": "critical", "packageName": "openssl",
             "packageVersion": "3.0.2", "fixDate": "3.0.13",
             "description": "OpenSSL denial of service via crafted X.509 certificate."},
            {"id": "CVE-2023-44487", "severity": "high", "packageName": "nghttp2",
             "packageVersion": "1.43.0", "fixDate": "1.57.0",
             "description": "HTTP/2 Rapid Reset DoS."},
            {"id": "CVE-2022-37434", "severity": "medium", "packageName": "zlib",
             "packageVersion": "1.2.11", "fixDate": "1.2.12",
             "description": "Heap buffer over-read in inflate()."},
        ],
    }],
}


# ============================================================
# Entrypoint
# ============================================================
def fetch_report(run_id: Optional[int] = None) -> list[Vulnerability]:
    """The one function that does everything: find run -> download -> parse."""
    run = find_run(run_id)
    artifacts = list_artifacts(run["id"])
    matching = [a for a in artifacts if ARTIFACT_NAME_HINT in a["name"]] or artifacts
    if not matching:
        raise RuntimeError(f"No artifacts found on run {run['id']}")
    target_artifact = matching[0]
    log.info("Using artifact: %s", target_artifact)

    zip_bytes = download_artifact_zip(target_artifact["id"])
    report = extract_json_report(zip_bytes) if zip_bytes is not None else DEMO_PRISMA_REPORT
    return parse_prisma_report(report)


def main():
    parser = argparse.ArgumentParser(description="Fetch a Prisma vulnerability report from a completed GitHub Actions run.")
    parser.add_argument("--run-id", type=int, default=None, help="Specific run ID to fetch (default: latest completed & successful run)")
    parser.add_argument("--output", type=str, default="vulnerability_report.json", help="Output file path")
    args = parser.parse_args()

    if not GITHUB_TOKEN:
        log.warning("GITHUB_TOKEN not set -- running in DRY-RUN mode with bundled demo data.")

    try:
        vulns = fetch_report(args.run_id)
    except (RunNotFoundError, RunNotSuccessfulError) as e:
        log.error(str(e))
        sys.exit(1)

    for v in vulns:
        print(f"{v.severity:8s} {v.cve_id:16s} {v.package_name} {v.package_version} -> fix {v.fix_version}")

    report_json = json.dumps([dataclasses.asdict(v) for v in vulns], indent=2)
    with open(args.output, "w") as f:
        f.write(report_json)
    log.info("Saved %d vulnerabilities to %s", len(vulns), args.output)


if __name__ == "__main__":
    main()
