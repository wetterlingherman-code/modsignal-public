"""Prepare a small ModSignal demo subset from alexandrainst/scandi-reddit.

The source dataset only exposes public text-level fields such as:
doc, subreddit, language, and language_confidence.

Moderation fields like reports, risk level, parent comment, and suggested
action are derived here for prototype UX. They are not hidden dataset fields.
"""

from __future__ import annotations

import argparse
import json
import math
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

from datasets import Dataset, load_dataset


DATASET_NAME = "alexandrainst/scandi-reddit"
DATASET_CONFIG = "da"
DEFAULT_OUTPUT = Path("public/data/modsignal_cases.json")

HIGH_TERMS = {
    "idiot",
    "hader",
    "fuck",
    "fucking",
    "lort",
    "pis",
    "racist",
    "nazist",
    "forbyd",
    "banned",
}
MEDIUM_TERMS = {
    "dum",
    "løgn",
    "loegn",
    "skam",
    "vred",
    "sur",
    "aldrig",
    "altid",
    "skyld",
    "ødelagt",
}


def load_rows(sample_pool: int, prefer_hub: bool = False) -> list[dict]:
    """Load a manageable pool from HuggingFace or the local Arrow cache.

    The explicit load_dataset call is kept here because this script is the
    backend/data-preparation layer for the prototype:

        ds = load_dataset("alexandrainst/scandi-reddit", "da")

    For local development, the cached Arrow shard is much faster and avoids
    repeatedly constructing the full multi-million-row dataset.
    """

    if prefer_hub:
        try:
            ds = load_dataset(DATASET_NAME, DATASET_CONFIG, split=f"train[:{sample_pool}]")
            return list(ds)
        except Exception:
            pass

    try:
        cache_root = (
            Path.home()
            / ".cache"
            / "huggingface"
            / "datasets"
            / "alexandrainst___scandi-reddit"
            / DATASET_CONFIG
        )
        arrow_files = sorted(cache_root.glob("**/scandi-reddit-train-*.arrow"))
        if not arrow_files:
            raise RuntimeError(
                "Could not load HuggingFace dataset and no local Arrow cache was found."
            )

        dataset = Dataset.from_file(str(arrow_files[0]))
        return [dataset[i] for i in range(min(sample_pool, len(dataset)))]
    except Exception as exc:
        raise RuntimeError(
            "Could not load HuggingFace dataset and no local Arrow cache was found."
        ) from exc


def clean_text(value: object) -> str:
    text = str(value or "").replace("\n", " ").strip()
    return " ".join(text.split())


def risk_from_text(text: str, index: int) -> dict:
    """Derive prototype risk from visible text features, not hidden labels."""

    lower = text.lower()
    words = lower.split()
    exclamations = text.count("!")
    question_marks = text.count("?")
    caps_words = sum(1 for word in text.split() if len(word) > 3 and word.isupper())
    high_hits = sum(1 for term in HIGH_TERMS if term in lower)
    medium_hits = sum(1 for term in MEDIUM_TERMS if term in lower)
    intensity = min(34, exclamations * 4 + question_marks * 2 + caps_words * 5)
    length_pressure = min(18, max(0, len(words) - 28) // 4)
    keyword_pressure = high_hits * 24 + medium_hits * 10

    toxicity_score = min(98, 8 + keyword_pressure + intensity + length_pressure)
    escalation_score = min(
        98,
        10 + toxicity_score * 0.62 + (index % 7) * 3 + (12 if len(words) > 42 else 0),
    )
    risk_score = round((toxicity_score * 0.56) + (escalation_score * 0.44))

    if risk_score >= 72:
        risk_level = "high"
        suggested_action = "warn"
    elif risk_score >= 50:
        risk_level = "med"
        suggested_action = "monitor"
    elif risk_score >= 32:
        risk_level = "watch"
        suggested_action = "review context"
    else:
        risk_level = None
        suggested_action = "no action"

    reports = 0
    if risk_level == "high":
        reports = 2 + (index % 4)
    elif risk_level == "med":
        reports = index % 3
    elif risk_level == "watch":
        reports = index % 2

    signals = []
    if high_hits:
        signals.append("Strong language terms detected in public comment text.")
    if medium_hits:
        signals.append("Language intensity suggests a discussion may be heating up.")
    if exclamations or question_marks > 1:
        signals.append("Punctuation pattern suggests rising emotional intensity.")
    if len(words) > 42:
        signals.append("Long argumentative comment may anchor a reply chain.")
    if not signals:
        signals.append("Low visible escalation signals; keep as background context.")

    return {
        "toxicity_score": round(toxicity_score),
        "escalation_score": round(escalation_score),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reports": reports,
        "risk_signals": signals[:3],
        "suggested_action": suggested_action,
    }


def build_cases(rows: list[dict], size: int) -> dict:
    rng = random.Random(42)
    usable_rows = [
        row
        for row in rows
        if len(clean_text(row.get("doc"))) >= 28 and row.get("language") == DATASET_CONFIG
    ]
    rng.shuffle(usable_rows)
    usable_rows = usable_rows[:size]

    now = datetime.now(timezone.utc).replace(microsecond=0)
    thread_title = "Dansk Reddit-tråd om nyhedsmoderation og platformsansvar"
    branch_ids = ["policy", "source-check", "personal-tone", "meta-moderation"]
    tones = ["neutral", "skeptical", "heated", "corrective", "supportive"]

    comments = []
    previous_by_branch: dict[str, dict] = {}
    for index, row in enumerate(usable_rows):
        text = clean_text(row.get("doc"))
        derived = risk_from_text(text, index)
        branch_id = branch_ids[index % len(branch_ids)]
        depth = 0 if index < 4 else min(3, 1 + (index + len(text)) % 3)
        parent = previous_by_branch.get(branch_id) if depth else None
        timestamp = now - timedelta(minutes=8 + index * 7)

        tags = []
        if derived["reports"]:
            tags.append(f"{derived['reports']} reports")
        if derived["risk_level"] == "high":
            tags.extend(["heated branch", "priority review"])
        elif derived["risk_level"] == "med":
            tags.extend(["escalating tone", "context needed"])
        elif derived["risk_level"] == "watch":
            tags.extend(["watch", "reply chain"])

        comment = {
            "id": f"sr-da-{index + 1:03d}",
            "username": f"scandi_reader_{1000 + index}",
            "user": f"scandi_reader_{1000 + index}",
            "subreddit": clean_text(row.get("subreddit")) or "Denmark",
            "thread_title": thread_title,
            "comment_text": text,
            "text": text,
            "parent_comment": parent["comment_text"] if parent else None,
            "parentId": parent["id"] if parent else None,
            "branchId": branch_id,
            "depth": depth,
            "timestamp": timestamp.isoformat(),
            "age": f"{8 + index * 7}m",
            "reports": derived["reports"],
            "toxicity_score": derived["toxicity_score"],
            "escalation_score": derived["escalation_score"],
            "risk_level": derived["risk_level"],
            "flag": derived["risk_level"],
            "risk": derived["risk_score"],
            "status": "open" if derived["risk_level"] else "background",
            "risk_signals": derived["risk_signals"],
            "suggested_action": derived["suggested_action"],
            "tags": tags,
            "tone": tones[(index + derived["risk_score"]) % len(tones)],
            "votes": int(12 + math.sqrt(len(text)) * 18 + (index % 11) * 9),
            "karma": f"{rng.randint(1, 58)}.{rng.randint(0, 9)}k",
            "avatarHue": 20 + (index * 47) % 320,
        }
        comments.append(comment)
        previous_by_branch[branch_id] = comment

    priority = [comment for comment in comments if comment["risk_level"]]
    high_count = sum(1 for comment in comments if comment["risk_level"] == "high")
    med_count = sum(1 for comment in comments if comment["risk_level"] == "med")
    watch_count = sum(1 for comment in comments if comment["risk_level"] == "watch")
    avg_toxicity = round(
        sum(comment["toxicity_score"] for comment in comments) / max(1, len(comments))
    )

    return {
        "source": {
            "dataset": DATASET_NAME,
            "config": DATASET_CONFIG,
            "generated_at": now.isoformat(),
            "notes": "Reports, risk scores, thread nesting, statuses, and actions are derived prototype fields.",
        },
        "thread": {
            "community": "Denmark",
            "title": thread_title,
            "body": (
                "Prototype thread built from a small transformed subset of Danish "
                "Scandi Reddit comments. Moderation signals are derived from visible text."
            ),
            "upvotes": "8.7k",
            "commentCount": len(comments),
            "posted": "4h",
            "author": "mod_researcher",
        },
        "overview": {
            "heat": min(94, 34 + high_count * 9 + med_count * 5 + watch_count * 2),
            "heatLabel": "High" if high_count else "Medium",
            "trend": f"+{len(priority)} / 30min",
            "toxicity": avg_toxicity,
            "velocity": 68 + len(priority) * 3,
            "alerts": len(priority),
        },
        "comments": comments,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--size", type=int, default=80, help="Number of comments to cache.")
    parser.add_argument("--pool", type=int, default=800, help="Rows to inspect before sampling.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--prefer-hub",
        action="store_true",
        help="Use load_dataset() first; default reads the local HuggingFace Arrow cache.",
    )
    args = parser.parse_args()

    rows = load_rows(args.pool, prefer_hub=args.prefer_hub)
    payload = build_cases(rows, args.size)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(payload['comments'])} comments to {args.output}")


if __name__ == "__main__":
    main()
