#!/usr/bin/env python3
"""soul/soul.py — the spiritual way as a background process.

Runs in GitHub Actions on every push and every day at 05:30 UTC.
Writes a 60-second stillness receipt to the workflow's job summary.
Never blocks, never enforces — it reminds. The machine remembers
the human, so the human may remain human.
"""
import json
import os
import sys
from datetime import datetime, timezone

WISDOM_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wisdom.json")

def main() -> None:
    with open(WISDOM_PATH, encoding="utf-8") as f:
        wisdom = json.load(f)
    now = datetime.now(timezone.utc)
    day = now.timetuple().tm_yday
    item = wisdom[day % len(wisdom)]

    lines = [
        "## 🤍 stillness — 60 seconds for the builder",
        "",
        f"> {item['text']}",
        f"> — {item['source']}",
        "",
        "**The background process:** this workflow never tells you what to believe.",
        "It only remembers what the hurried mind forgets:",
        "",
        "1. **Breathe.** Box breathing 4·4·4·4 — in, hold, out, hold. Four rounds, right now.",
        "2. **Move.** Stand, stretch, 20 steps. (WHO: 150–300 min of movement per week.)",
        "3. **Drink.** One glass of water before the next commit.",
        "4. **Grateful.** Name three things you are grateful for, silently, now.",
        "5. **Remember.** The intelligence you build or borrow is not the measure of you.",
        "",
        f"*Ran quietly on {now.strftime('%Y-%m-%d %H:%M UTC')} · day {day} · High on Intelligence · Aethric*",
        "",
        "*“And that which is useful to people remains on earth.”*",
    ]
    out = "\n".join(lines)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write(out + "\n")
    print(out)
    return None

if __name__ == "__main__":
    sys.exit(main())
