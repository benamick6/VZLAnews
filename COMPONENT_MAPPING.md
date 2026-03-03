# Component Mapping: VZLAnews → SEACoastalNews

This file maps each component of the original Venezuela News System to its Southeast Asia Coastal equivalent, showing exactly what was changed and why.

---

## 📁 File Structure Mapping

| Original | SE Asia Equivalent | Changes |
|----------|-------------------|---------|
| `README.md` | `README_SEASIA_COASTAL.md` | Auto-generated; shows regional digest |
| `config.yml` | `config_seasia_coastal.yml` | 9 countries, 5 topics, coastal focus |
| `feeds.txt` | `feeds_seasia_coastal.txt` | Regional + country-specific feeds |
| `fetch_news.py` | `fetch_news_seasia.py` | Multi-country support, topic filtering |
| `generateBrief.js` | `generateBrief_seasia.js` | Audience-specific briefs, country/topic splits |
| `package.json` | (unchanged) | Still uses OpenAI/feedparser, add openai SDK |
| `requirements.txt` | (unchanged) | Still just feedparser |

---

## 🔄 Component Detail Mapping

### 1. Configuration Layer

#### Original: `config.yml`
```yaml
country:
  name: "Venezuela"
  iso2: "VE"
  iso3: "VEN"
brief_sections:
  - "Extractives & Mining"
  - "Food & Agriculture"
  - "Health & Water"
```

#### SE Asia: `config_seasia_coastal.yml`
```yaml
countries:
  - {name: "Vietnam", iso2: "VN"}
  - {name: "Thailand", iso2: "TH"}
  - (7 more countries)
brief_sections:
  - "Marine Security & Governance"
  - "Sustainable Fisheries & Aquaculture"
  - "Coastal Environmental Health"
  - "Blue Economy & Livelihoods"
  - "Maritime Climate Change"
```

**Key changes:**
- ✅ Single country → 9 countries
- ✅ Extractive industries → Marine/coastal topics
- ✅ Added language support (Vietnamese, Thai, etc.)
- ✅ Added geographic focus (Mekong, South China Sea, EEZs)

---

### 2. Data Sources (Feeds)

#### Original: `feeds.txt` Structure
```
# ============================
# VENEZUELA – MACRO & POLICY
# ============================

# HIGH-PRIORITY WIRE SERVICES
AP News – Venezuela Hub - https://rsshub.app/apnews/topics/apf-venezuela
ReliefWeb – Venezuela - https://reliefweb.int/country/ven/rss.xml

# ============================
# EXTRACTIVES & MINING
# ============================
Google News – Venezuela oil gas - https://news.google.com/rss/search?q=Venezuela+oil+gas
```

#### SE Asia: `feeds_seasia_coastal.txt` Structure
```
# ============================
# REGIONAL NEWS AGGREGATORS
# ============================
BenarNews (RFA) – Southeast Asia - https://www.rfa.org/english/news/rss.xml
East Asia Forum – Regional Analysis - https://www.eastasiaforum.org/feed/

# ============================
# MARINE & FISHERIES GENERAL
# ============================
FAO Fisheries News - http://www.fao.org/news/rss-feed/en
SEAFDEC - https://www.seafdec.org/feed/

# ============================
# COUNTRY SPECIFIC FEEDS
# ============================
# --- VIETNAM ---
Vietnam News Agency (VNA) - https://www.vietnamplus.vn/rss
VnExpress International - https://vnexpress.net/?category=home&format=rss

# --- THAILAND ---
Bangkok Post - https://www.bangkokpost.com/breaking-news/rss
```

**Key changes:**
- ✅ 50+ country-specific feeds → 9 countries with 6+ feeds each
- ✅ Oil/mining focused → Marine/fisheries focused
- ✅ Added international organizations (FAO, SEAFDEC, IUCN)
- ✅ Added transboundary theme (South China Sea, Mekong River Commission)

---

### 3. Python Fetcher

#### Original: `fetch_news.py`
```python
FEEDS = [
    {"name": "El Nacional", "url": "https://el-nacional.com/feed/"},
    {"name": "Efecto Cocuyo", "url": "https://efectococuyo.com/feed/"},
]

MAX_ITEMS_PER_FEED = 5
README_PATH = "README.md"

def fetch_feed(feed_info: dict) -> list[dict]:
    """Parse RSS and return articles"""
    parsed = feedparser.parse(feed_info["url"])
    # Returns all entries without topic filtering
```

#### SE Asia: `fetch_news_seasia.py`
```python
COUNTRIES = {
    "VN": {"name": "Vietnam", "lang": "vi"},
    "TH": {"name": "Thailand", "lang": "th"},
    # ... 7 more
}

MARINE_TOPICS = {
    "sustainable_fisheries": ["fisheries", "aquaculture", "fish stocks"],
    "marine_security": ["maritime", "EEZ", "territorial waters"],
    # ... 3 more topics
}

MAX_ITEMS_PER_FEED = 8

def is_relevant(title: str, summary: str = "") -> tuple[bool, list[str]]:
    """Check if article matches country + marine topics"""
    geo_match = any(kw in text for kw in COUNTRY_KEYWORDS)
    topics_found = check_all_topics(text)
    return geo_match and len(topics_found) > 0, topics_found

def deduplicate_articles(articles) -> list[dict]:
    """Remove duplicates using 85% title similarity"""

def organize_by_country(articles) -> dict[str, list]:
    """Multi-country organization"""

def organize_by_topic(articles) -> dict[str, list]:
    """Topic-based organization"""
```

**Key changes:**
- ✅ No filtering → Topic + geographic relevance filtering
- ✅ Single output → Multi-country, multi-topic organization
- ✅ No deduplication → 85% similarity-based deduplication
- ✅ No country assignment → Automatic country code extraction
- ✅ All articles treated equally → Relevance scoring

---

### 4. JavaScript Brief Generation

#### Original: `generateBrief.js`
```javascript
const ARTICLES_PATH = "./data/articles.json";
const BRIEF_PATH = "./data/executiveBrief.json";

async function generateBrief() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8"));
  
  const prompt = `
    You are writing a neutral executive brief.
    Constraints:
    - Max 6 sentences total.
    - No generic phrases.
    - Use specific facts.
    ${combinedText}
  `;
  
  // Single brief for all articles
  const response = await openai.chat.completions.create({...});
  fs.writeFileSync(BRIEF_PATH, JSON.stringify(...));
}
```

#### SE Asia: `generateBrief_seasia.js`
```javascript
const ARTICLES_PATH = "./data/seasia_coastal/articles_raw";
const BRIEF_BY_COUNTRY_DIR = "./data/seasia_coastal/by_country";

const AUDIENCE_TYPES = {
  grassroot_leader: {
    tone: "practical, action-focused",
    focus: "livelihood impacts, local action items"
  },
  policymaker: {
    tone: "analytical, evidence-based",
    focus: "governance gaps, policy recommendations"
  },
  researcher_ngo: {
    tone: "academic, data-driven",
    focus: "evidence base, research implications"
  }
};

async function generateBriefForArticles(articles, audience) {
  // Audience-specific prompt generation
  const prompt = buildPromptForAudience(articles, audience);
  // Generate brief
}

async function generateCountryBriefs(articles) {
  // One brief per country
}

async function generateTopicBriefs(articles) {
  // One brief per topic
  // Uses TOPIC_CONTEXT for specialized framing
}

// Main generates: regional + country + topic briefs
```

**Key changes:**
- ✅ Single brief → Multiple audience-specific briefs
- ✅ All countries together → Country-specific briefs
- ✅ Flat structure → Country-level + topic-level organization
- ✅ Generic analysis → Grassroot leader, policymaker, and researcher angles
- ✅ One output file → 9+ output files (one per country + topic)

---

## 📊 Data Model Differences

### Original: Simple Article Model
```json
{
  "title": "string",
  "link": "string",
  "published": "string",
  "source": "string"
}
```

### SE Asia: Rich Article Model
```json
{
  "id": "unique_hash",
  "title": "string",
  "url": "string",
  "published": "ISO8601",
  "source": "string",
  "countries": ["VN", "TH"],        // NEW: Multi-country
  "topics": ["marine_security"],    // NEW: Topic tagging
  "relevance_score": 0.8,           // NEW: Scoring
  "summary": "string",
  "extracted_text": "string",
  "local_language": "vi",           // NEW: Language tracking
  "local_text": "string",           // NEW: Native text
  "geographic_entities": ["..."],   // NEW: Named entities
  "action_items": [                 // NEW: Grassroot guidance
    {"action": "...", "audience": "..."}
  ],
  "livelihood_impact": "high_threat", // NEW: Impact assessment
  "status": "active"
}
```

---

## 🎯 Output Structure Mapping

### Original VZLAnews Outputs
```
README.md                           # Single regional digest
data/articles.json                  # All articles
data/executiveBrief.json            # Single brief
```

### SE Asia Coastal Outputs
```
README_SEASIA_COASTAL.md            # Regional digest
data/seasia_coastal/
  ├── articles_raw/
  │   └── articles_YYYYMMDD_HHMMSS.json  # Timestamped archives
  ├── BRIEF.json                   # Regional brief (all audiences)
  ├── by_country/
  │   ├── VN/
  │   │   ├── README.md            # Vietnam digest
  │   │   └── BRIEF.json           # Vietnam brief
  │   ├── TH/
  │   │   ├── README.md
  │   │   └── BRIEF.json
  │   └── ... (7 more countries)
  ├── by_topic/
  │   ├── sustainable_fisheries/
  │   ├── marine_security/
  │   ├── climate_coastal/
  │   ├── marine_pollution/
  │   └── blue_economy/
  └── schema.json                  # Data format specification
```

---

## 🔄 Processing Flow Comparison

### Original: VZLAnews Flow
```
FEEDS (Venezuela-focused)
    ↓
fetch_news.py
    → Parse all feeds (no filtering)
    → Output: articles.json (all sources mixed)
    ↓
generateBrief.js
    → Read articles.json
    → OpenAI synthesis
    → Output: executiveBrief.json (single brief)
    ↓
README.md (updated with new articles)
```

### SE Asia: Coastal Flow
```
FEEDS_SEASIA (9 countries, regional + country-specific)
    ↓
fetch_news_seasia.py
    → Parse all feeds
    → Filter by: geography + marine topics
    → Deduplicate (85% similarity)
    → Assign country codes & topic tags
    → Relevance scoring
    → Output: articles_YYYYMMDD_HHMMSS.json (archived)
    ↓
Organize by country
    ↓ (parallel)
Organize by topic
    ↓
generateBrief_seasia.js
    → Regional brief (grassroot leaders)
    → Country briefs (9x local action focus)
    → Topic briefs (research/policy focus)
    → Audience-specific angles
    → Output: BRIEF.json + by_country/[COUNTRY]/BRIEF.json
    ↓
README_SEASIA_COASTAL.md (regional digest)
by_country/[CODE]/README.md (country digests - 9 files)
by_country/[CODE]/BRIEF.json (country briefs - 9 files)
```

---

## 🎯 Key Transformation Patterns

| Aspect | Venezuela Original | SE Asia Coastal | Reason |
|--------|-------------------|-----------------|---------|
| **Geographic Scope** | 1 country (VE) | 9 countries | Regional perspective for leaders |
| **Topic Structure** | Mining, Agriculture, Health | Marine Security, Fisheries, Climate, Pollution | Coastal community focus |
| **Feed Strategy** | National news outlets | Regional + country-specific + international experts | Multi-level coverage |
| **Filtering** | Country-only | Country + topic relevance | Reduce noise, increase relevance |
| **Output Granularity** | Single nation digest | Regional + 9 country + 5 topic digests | Enable local action |
| **Brief Audience** | Single (implied policymakers) | 3 types (grassroot, policy, research) | Different decision-makers need different angles |
| **Language Support** | Spanish/English | English + all 8 local languages | Accessibility for local leaders |
| **Data Richness** | Basic (title, link, date) | Rich (country, topic, livelihood impact, action items) | Actionability |
| **Deduplication** | None | 85% similarity-based | Cross-regional duplication |
| **Archiving** | None | Timestamped daily archives | Historical tracking |

---

## 📈 Scaling Implications

### Adding New Countries
1. Add to `config_seasia_coastal.yml` → `countries[]`
2. Add country-specific feeds to `feeds_seasia_coastal.txt`
3. Script automatically creates `data/seasia_coastal/by_country/[NEW_CODE]/`
4. No code changes needed; configuration-driven

### Adding New Topics
1. Add to `config_seasia_coastal.yml` → `topics[]`
2. Define keywords for filtering
3. Update `MARINE_TOPICS` in `fetch_news_seasia.py`
4. Update brief generation context in `generateBrief_seasia.js`
5. Script auto-organizes by new topic

### Multi-Audience Support
1. Modify `AUDIENCE_TYPES` in `generateBrief_seasia.js`
2. Each `generateBriefForArticles(articles, audience)` call generates audience-specific brief
3. Save separate briefs for each audience
4. No changes to fetcher needed

---

## ✅ Testing Mapping

### Original Test Scenarios
```
✓ Fetches feed without errors
✓ Parses RSS correctly
✓ Updates README with latest articles
✓ OpenAI integration works
✓ Brief generation succeeds
```

### SE Asia Additional Test Scenarios
```
✓ Filters by country correctly
✓ Deduplicates across feeds
✓ Assigns topics accurately
✓ Extracts country codes from text
✓ Generates country-specific digests (9x)
✓ Generates topic-specific briefs (5x)
✓ Produces audience-specific briefs (3x)
✓ Archives with timestamps
✓ Handles multi-language metadata
```

---

## 🚀 Migration Checklist

- [ ] Clone original VZLAnews repo
- [ ] Review this mapping document
- [ ] Create SE Asia configuration files:
  - [ ] `config_seasia_coastal.yml`
  - [ ] `feeds_seasia_coastal.txt`
- [ ] Adapt Python script:
  - [ ] Copy → `fetch_news_seasia.py`
  - [ ] Add country/topic definitions
  - [ ] Add filtering logic
  - [ ] Add deduplication
  - [ ] Test with sample feeds
- [ ] Adapt JavaScript brief generator:
  - [ ] Copy → `generateBrief_seasia.js`
  - [ ] Add audience types
  - [ ] Add topic context
  - [ ] Add country/topic brief generation
  - [ ] Test with sample data
- [ ] Create data schema:
  - [ ] `data/seasia_coastal/schema.json`
- [ ] Set up directory structure
- [ ] Test complete pipeline end-to-end
- [ ] Create GitHub Actions workflow (optional)
- [ ] Document for grassroot leaders

---

## 📖 Further Customization Ideas

### For Researchers
- Add citation tracking
- Link to academic databases
- Create signal history (trend analysis)

### For Policymakers
- Add policy gaps analysis
- Track government responses
- Link to governance mechanisms

### For Grassroot Leaders
- Add local contact directory
- Simplify language (grade 6 level)
- Add "what to do" action cards
- Include livelihood impact scores
- Add resource links (training, funding, tools)

### For All
- Multi-language output (auto-translate)
- RSS feed of the digests for subscription
- Mobile-friendly HTML version
- Email notification alerts
- Slack/Teams integration

