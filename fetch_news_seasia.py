#!/usr/bin/env python3
"""
Fetch latest news from Southeast Asia coastal communities RSS feeds.
Focus: sustainable fisheries, climate change, marine security, marine pollution
Target: grassroot leaders in Vietnam, Thailand, Philippines, Indonesia, etc.
"""

import feedparser
import json
import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from difflib import SequenceMatcher

# Configuration
COUNTRIES = {
    "VN": {"name": "Vietnam", "lang": "vi"},
    "TH": {"name": "Thailand", "lang": "th"},
    "PH": {"name": "Philippines", "lang": "tl"},
    "ID": {"name": "Indonesia", "lang": "id"},
    "MY": {"name": "Malaysia", "lang": "ms"},
    "MM": {"name": "Myanmar", "lang": "my"},
    "KH": {"name": "Cambodia", "lang": "km"},
    "SG": {"name": "Singapore", "lang": "en"},
    "BN": {"name": "Brunei", "lang": "ms"},
}

# Marine/Coastal Topic Keywords
MARINE_TOPICS = {
    "sustainable_fisheries": [
        "fisheries", "sustainable fishing", "aquaculture", "fish stocks",
        "overfishing", "IUU fishing", "fishing community", "seafood"
    ],
    "marine_security": [
        "maritime security", "marine sovereignty", "EEZ", "exclusive economic zone",
        "territorial waters", "maritime dispute", "South China Sea", "piracy"
    ],
    "climate_coastal": [
        "sea level rise", "coastal erosion", "climate adaptation", "typhoon",
        "extreme weather", "mangrove", "coral", "flood"
    ],
    "marine_pollution": [
        "marine pollution", "ocean plastic", "oil spill", "mercury",
        "microplastics", "chemical contamination", "waste management"
    ],
    "blue_economy": [
        "blue economy", "maritime trade", "shipping", "port", "livelihood"
    ],
}

COUNTRY_KEYWORDS = list(COUNTRIES.values()) + [
    "southeast asia", "mekong", "south china sea", "andaman", "gulf of thailand"
]

MAX_ITEMS_PER_FEED = 8
README_PATH = "README_SEASIA_COASTAL.md"
DATA_DIR = Path("./data/seasia_coastal")
ARCHIVE_DIR = DATA_DIR / "articles_raw"


def create_directories():
    """Create necessary directory structure."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "by_country").mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "by_topic").mkdir(parents=True, exist_ok=True)


def generate_id(title: str, url: str) -> str:
    """Generate unique ID for article based on title and URL."""
    combined = f"{title}|{url}"
    return hashlib.md5(combined.encode()).hexdigest()[:12]


def is_relevant(title: str, summary: str = "") -> tuple[bool, list[str]]:
    """
    Check if article is relevant to coastal/marine topics.
    Returns (is_relevant, topics_found)
    """
    text = f"{title} {summary}".lower()
    
    # Check for geographic relevance
    geo_match = any(kw.lower() in text for kw in COUNTRY_KEYWORDS)
    if not geo_match:
        return False, []
    
    # Check for topic relevance
    topics_found = []
    for topic, keywords in MARINE_TOPICS.items():
        if any(kw.lower() in text for kw in keywords):
            topics_found.append(topic)
    
    return len(topics_found) > 0, topics_found


def extract_country_codes(title: str, feed_country: Optional[str] = None) -> list[str]:
    """Extract country codes mentioned in article title."""
    if feed_country:
        return [feed_country]
    
    countries_found = []
    title_lower = title.lower()
    
    for code, info in COUNTRIES.items():
        if info["name"].lower() in title_lower:
            countries_found.append(code)
    
    return countries_found or ["ZZ"]  # "ZZ" for regional/unspecified


def fetch_feed(feed_url: str, feed_name: str, country_code: Optional[str] = None) -> list[dict]:
    """Parse a single RSS feed and return relevant articles."""
    try:
        parsed = feedparser.parse(feed_url)
        articles = []
        
        for entry in parsed.entries[:MAX_ITEMS_PER_FEED]:
            title = entry.get("title", "").strip()
            link = entry.get("link", "").strip()
            published = entry.get("published", "")
            summary = entry.get("summary", "").strip()
            
            if not (title and link):
                continue
            
            # Check relevance
            is_relevant_article, topics = is_relevant(title, summary)
            if not is_relevant_article:
                continue
            
            # Extract countries mentioned
            countries = extract_country_codes(title, country_code)
            
            article_id = generate_id(title, link)
            
            articles.append({
                "id": article_id,
                "title": title,
                "url": link,
                "published": published,
                "source": feed_name,
                "feed_url": feed_url,
                "countries": countries,
                "topics": topics,
                "summary": summary[:300] if summary else "",
                "relevance_score": len(topics) / len(MARINE_TOPICS),  # Simple scoring
            })
        
        return articles
    
    except Exception as e:
        print(f"❌ Error fetching {feed_name}: {e}")
        return []


def deduplicate_articles(all_articles: list[dict]) -> list[dict]:
    """Remove duplicate articles based on title similarity."""
    if not all_articles:
        return []
    
    unique = []
    seen_ids = set()
    
    for article in sorted(all_articles, key=lambda x: x["relevance_score"], reverse=True):
        article_id = article["id"]
        
        # Check exact ID match
        if article_id in seen_ids:
            continue
        
        # Check title similarity with existing articles
        is_duplicate = False
        for existing in unique:
            similarity = SequenceMatcher(
                None, 
                article["title"].lower(), 
                existing["title"].lower()
            ).ratio()
            if similarity > 0.85:  # 85% similar = duplicate
                is_duplicate = True
                break
        
        if not is_duplicate:
            unique.append(article)
            seen_ids.add(article_id)
    
    return unique


def organize_by_country(articles: list[dict]) -> dict[str, list[dict]]:
    """Organize articles by country."""
    organized = {code: [] for code in COUNTRIES.keys()}
    organized["ZZ"] = []  # Regional/unspecified
    
    for article in articles:
        for country in article["countries"]:
            if country in organized:
                organized[country].append(article)
    
    return organized


def organize_by_topic(articles: list[dict]) -> dict[str, list[dict]]:
    """Organize articles by topic."""
    organized = {topic: [] for topic in MARINE_TOPICS.keys()}
    
    for article in articles:
        for topic in article["topics"]:
            if topic in organized:
                organized[topic].append(article)
    
    return organized


def build_country_markdown(country_code: str, articles: list[dict]) -> str:
    """Build markdown for a specific country."""
    country_name = COUNTRIES.get(country_code, {}).get("name", "Unknown")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    
    lines = [
        f"# 🌊 {country_name} – Coastal News",
        "",
        f"> Last updated: **{now}**",
        "",
        f"News and updates for coastal communities in {country_name} focused on "
        "sustainable fisheries, climate change, marine security, and pollution.",
        "",
        "---",
        "",
    ]
    
    if not articles:
        lines.append("No articles found.")
    else:
        # Group by topic
        by_topic = organize_by_topic(articles)
        
        for topic, topic_articles in by_topic.items():
            if not topic_articles:
                continue
            
            topic_display = topic.replace("_", " ").title()
            lines.append(f"## {topic_display}")
            lines.append("")
            
            for article in topic_articles[:8]:  # Max 8 per topic
                pub = f" — {article['published']}" if article.get("published") else ""
                lines.append(f"- [{article['title']}]({article['url']}){pub}")
            
            lines.append("")
    
    lines += [
        "---",
        "",
        f"*Updated by fetch_news_seasia.py • Data: {len(articles)} relevant articles*",
    ]
    
    return "\n".join(lines)


def build_regional_markdown(articles: list[dict]) -> str:
    """Build regional overview markdown."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    
    lines = [
        "# 🌏 Southeast Asia Coastal Communities – Regional News Digest",
        "",
        f"> Last updated: **{now}**",
        "",
        "Automated digest (updated every 12 hours) of news from coastal communities "
        "across Southeast Asia focused on sustainable fisheries, climate change, marine security, and pollution.",
        "",
        "---",
        "",
    ]
    
    # Group by topic
    by_topic = organize_by_topic(articles)
    
    for topic, topic_articles in by_topic.items():
        if not topic_articles:
            continue
        
        topic_display = topic.replace("_", " ").title()
        lines.append(f"## {topic_display}")
        lines.append("")
        
        # Group by country within topic
        by_country = {}
        for article in topic_articles:
            for country in article["countries"]:
                if country not in by_country:
                    by_country[country] = []
                by_country[country].append(article)
        
        for country_code in sorted(by_country.keys()):
            country_articles = by_country[country_code][:3]  # Max 3 per country
            country_name = COUNTRIES.get(country_code, {}).get("name", country_code)
            
            if country_code != "ZZ":
                lines.append(f"### {country_name}")
            
            for article in country_articles:
                pub = f" — {article['published']}" if article.get("published") else ""
                lines.append(f"- [{article['title']}]({article['url']}){pub}")
            
            lines.append("")
    
    lines += [
        "---",
        "",
        f"*Total articles: {len(articles)} • "
        "Generated by [fetch_news_seasia.py](fetch_news_seasia.py)*"
    ]
    
    return "\n".join(lines)


def save_json_archive(articles: list[dict], now_str: str):
    """Save articles as JSON for archiving."""
    archive_path = ARCHIVE_DIR / f"articles_{now_str}.json"
    with open(archive_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print(f"✅ Archived {len(articles)} articles to {archive_path}")


def main():
    """Main fetching routine."""
    print("🌊 Southeast Asia Coastal News Fetcher")
    print("=" * 50)
    
    create_directories()
    
    # Load feeds from config
    feeds = [
        {
            "name": "BenarNews",
            "url": "https://www.rfa.org/english/news/rss.xml",
            "country": None,
        },
        {
            "name": "The Straits Times",
            "url": "https://www.straitstimes.com/asia/?rsspage=popular",
            "country": "SG",
        },
        {
            "name": "SEAFDEC",
            "url": "https://www.seafdec.org/feed/",
            "country": None,
        },
        {
            "name": "FAO Asia",
            "url": "http://www.fao.org/asiapacific/en/rss/",
            "country": None,
        },
        {
            "name": "VnExpress",
            "url": "https://vnexpress.net/?category=home&format=rss",
            "country": "VN",
        },
        {
            "name": "Bangkok Post",
            "url": "https://www.bangkokpost.com/breaking-news/rss",
            "country": "TH",
        },
        {
            "name": "Manila Bulletin",
            "url": "https://www.mb.com.ph/rss-feeds",
            "country": "PH",
        },
        {
            "name": "Jakarta Post",
            "url": "https://www.thejakartapost.com/feed",
            "country": "ID",
        },
        {
            "name": "New Straits Times",
            "url": "https://www.nst.com.my/rss",
            "country": "MY",
        },
    ]
    
    all_articles = []
    
    # Fetch all feeds
    for feed in feeds:
        print(f"📡 Fetching {feed['name']}…")
        articles = fetch_feed(feed["url"], feed["name"], feed["country"])
        print(f"   → Found {len(articles)} relevant articles")
        all_articles.extend(articles)
    
    print(f"\n📊 Total articles fetched: {len(all_articles)}")
    
    # Deduplicate
    unique_articles = deduplicate_articles(all_articles)
    print(f"✅ After deduplication: {len(unique_articles)} unique articles")
    
    # Save archive
    now = datetime.now(timezone.utc)
    now_str = now.strftime("%Y%m%d_%H%M%S")
    save_json_archive(unique_articles, now_str)
    
    # Generate regional README
    regional_md = build_regional_markdown(unique_articles)
    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(regional_md)
    print(f"✅ Regional digest saved to {README_PATH}")
    
    # Generate country-specific READMEs
    by_country = organize_by_country(unique_articles)
    for country_code, articles in by_country.items():
        if not articles:
            continue
        
        country_md = build_country_markdown(country_code, articles)
        country_dir = DATA_DIR / "by_country" / country_code
        country_dir.mkdir(parents=True, exist_ok=True)
        
        readme_path = country_dir / "README.md"
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(country_md)
        print(f"✅ {country_code} digest saved")
    
    print("\n" + "=" * 50)
    print("✨ Update complete!")
    print(f"   Regional digest: {README_PATH}")
    print(f"   Country files: data/seasia_coastal/by_country/")
    print(f"   Archive: data/seasia_coastal/articles_raw/")


if __name__ == "__main__":
    main()

