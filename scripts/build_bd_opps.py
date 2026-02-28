import json
import re
import os
import datetime
from urllib.parse import urlparse

LATEST_JSON = "docs/data/latest.json"
OUT_JSON = "docs/data/bd_opps.json"

OPP_TERMS = [
    "request for proposal", "rfp", "request for information", "rfi",
    "request for quotation", "rfq", "tender", "procurement", "invitation to bid", "itb",
    "call for proposals", "call for applications", "open call",
    "expression of interest", "eoi", "terms of reference", "tor",
    "grant", "funding opportunity", "services required", "consultancy", "consultant"
]

EXCLUDE_TERMS = ["opinion", "commentary", "podcast", "video", "newsletter", "profile", "interview"]

DEADLINE_PATTERNS = [
    r"(deadline|due by|due|closing date|closes|submission deadline)\s*[:\-]?\s*(\w+\s+\d{1,2},\s+20\d{2})",
    r"(deadline|due by|due|closing date|closes|submission deadline)\s*[:\-]?\s*(20\d{2}-\d{2}-\d{2})",
    r"(fecha l[ií]mite|cierre|vence|hasta el)\s*[:\-]?\s*(\d{1,2}\s+de\s+\w+\s+de\s+20\d{2})",
    r"(fecha l[ií]mite|cierre|vence|hasta el)\s*[:\-]?\s*(20\d{2}-\d{2}-\d{2})"
]

AMOUNT_PATTERNS = [
    r"(\$|usd\s*)\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(\s*(million|billion|m|bn))?",
    r"(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(usd|dollars)",
    r"(€)\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(\s*(million|billion|m|bn))?"
]

BOILERPLATE = [
    "Comprehensive up-to-date news coverage, aggregated from sources all over the world by Google News",
    "Comprehensive up-to-date news coverage, aggregated from sources all over the world by Google News."
]

_MONTHS_ES = {
    "enero": 1,
    "febrero": 2,
    "marzo": 3,
    "abril": 4,
    "mayo": 5,
    "junio": 6,
    "julio": 7,
    "agosto": 8,
    "septiembre": 9,
    "setiembre": 9,
    "octubre": 10,
    "noviembre": 11,
    "diciembre": 12,
}


def norm(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "")).strip()


def contains_any(text: str, terms) -> bool:
    low = text.lower()
    return any(term in low for term in terms)


def extract_deadline(text: str) -> str:
    for pattern in DEADLINE_PATTERNS:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return norm(match.group(2))
    return ""


def extract_amount(text: str) -> str:
    for pattern in AMOUNT_PATTERNS:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return norm(match.group(0))
    return ""


def _parse_deadline_date(raw: str) -> datetime.date | None:
    text = norm(raw)
    if not text:
        return None

    for fmt in ("%Y-%m-%d", "%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.datetime.strptime(text, fmt).date()
        except ValueError:
            continue

    es_match = re.match(r"^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(20\d{2})$", text.lower())
    if es_match:
        day = int(es_match.group(1))
        month_name = es_match.group(2)
        year = int(es_match.group(3))
        month = _MONTHS_ES.get(month_name)
        if month:
            try:
                return datetime.date(year, month, day)
            except ValueError:
                return None
    return None


def is_expired_deadline(raw_deadline: str, today: datetime.date) -> bool:
    parsed = _parse_deadline_date(raw_deadline)
    if parsed is None:
        return False
    return parsed < today


def guess_org(item: dict) -> str:
    publisher = norm(item.get("publisher") or "")
    if publisher:
        return publisher
    try:
        return urlparse(item.get("url", "")).netloc
    except Exception:
        return ""


def score_opp(text: str) -> int:
    low = text.lower()
    score = 0
    strong = [
        "rfp", "rfi", "rfq", "tender", "procurement", "itb", "tor",
        "expression of interest", "eoi", "grant", "call for proposals", "consultancy"
    ]
    for term in strong:
        if term in low:
            score += 3
    if extract_deadline(text):
        score += 2
    if extract_amount(text):
        score += 2
    return score


def split_sentences(value: str):
    parts = re.split(r"(?<=[\.\!\?])\s+(?=[A-ZÁÉÍÓÚÑ])", value.strip())
    return [part.strip() for part in parts if part.strip()]


def make_summary(item: dict, hay: str) -> str:
    org = guess_org(item)
    deadline = extract_deadline(hay)
    amount = extract_amount(hay)

    preview = norm(item.get("preview") or item.get("insight") or item.get("description") or item.get("snippet") or "")
    for boilerplate in BOILERPLATE:
        preview = preview.replace(boilerplate, "").strip()

    sentences = [sent for sent in split_sentences(preview) if len(sent) > 35]
    core = " ".join(sentences[:2]) if len(sentences) >= 2 else (sentences[0] if sentences else "")

    out = [f"Opportunity linked to Venezuela: {org} or its partners invite proposals, bids, or applications."]
    if core:
        out.append(core)

    if deadline or amount:
        tail = []
        if deadline:
            tail.append(f"Deadline: {deadline}")
        if amount:
            tail.append(f"Amount: {amount}")
        out.append("; ".join(tail) + ".")
    else:
        out.append("Open the link for eligibility, scope, and submission requirements.")

    return norm(" ".join(out[:3]))


def _items_from_latest(payload: dict) -> list[dict]:
    direct = payload.get("items")
    if isinstance(direct, list):
        return [it for it in direct if isinstance(it, dict)]

    all_items = payload.get("allItems")
    if isinstance(all_items, list):
        return [it for it in all_items if isinstance(it, dict)]

    sectors = payload.get("sectors")
    if isinstance(sectors, list):
        flattened = []
        for sector in sectors:
            if not isinstance(sector, dict):
                continue
            for item in sector.get("items") or []:
                if isinstance(item, dict):
                    flattened.append(item)
        return flattened
    return []


def main() -> None:
    with open(LATEST_JSON, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    items = _items_from_latest(data)
    opportunities = []
    today = datetime.datetime.now(datetime.timezone.utc).date()

    for item in items:
        hay = " ".join([
            norm(item.get("title")),
            norm(item.get("preview")),
            norm(item.get("insight2", {}).get("s1") if isinstance(item.get("insight2"), dict) else ""),
            norm(item.get("insight2", {}).get("s2") if isinstance(item.get("insight2"), dict) else ""),
            norm(item.get("description")),
            norm(item.get("snippet")),
            " ".join(item.get("tags") or []),
            " ".join(item.get("categories") or []),
        ])

        if not hay or len(hay) < 60:
            continue
        if not contains_any(hay, OPP_TERMS):
            continue

        score = score_opp(hay)
        if contains_any(hay, EXCLUDE_TERMS) and score < 5:
            continue
        if score < 5:
            continue

        deadline = extract_deadline(hay)
        if deadline and is_expired_deadline(deadline, today):
            continue

        opportunities.append({
            "id": item.get("id"),
            "title": item.get("title"),
            "url": item.get("url"),
            "sector": item.get("sector"),
            "publisher": item.get("publisher") or "",
            "publishedAt": item.get("publishedAt") or item.get("dateISO") or "",
            "deadline": deadline,
            "amount": extract_amount(hay),
            "score": score,
            "summary": make_summary(item, hay),
        })

    opportunities.sort(key=lambda opp: (-int(opp.get("score", 0)), str(opp.get("publishedAt", ""))))

    output = {
        "asOf": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "count": len(opportunities),
        "opportunities": opportunities[:25],
    }

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(output, fh, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
