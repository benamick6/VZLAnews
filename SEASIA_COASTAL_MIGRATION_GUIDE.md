# Southeast Asia Coastal Communities News System – Migration Guide

## 🌏 Project Overview

This is an adapter guide to transform **VZLAnews** (Venezuela-focused news aggregator) into **SEACoastalNews** – a news aggregation system for grassroot leaders in Southeast Asia focused on coastal community issues.

**Geographic Scope:** Southeast Asia (Vietnam, Thailand, Philippines, Indonesia, Cambodia, Laos, Myanmar, Malaysia, Brunei, Singapore)

**Core Topics:**
- 🐟 Sustainable Fisheries Management
- 🌊 Climate Change & Sea Level Rise
- ⚓ Marine Security & Sovereignty
- ♻️ Marine Pollution & Environmental Health
- 🚢 Transboundary Marine Issues

---

## 📋 Phase 1: Configuration Updates

### Step 1.1: Create Regional Config
**File:** `config_seasia_coastal.yml`

Key changes:
- **Country list:** Vietnam, Thailand, Philippines, Indonesia, Malaysia, Myanmar, Cambodia, Singapore, Brunei
- **Language support:** English (primary), Thai, Vietnamese, Indonesian, Filipino, Myanmar (secondary)
- **Geographic focus:** Coastal provinces, maritime zones, exclusive economic zones (EEZs)
- **Topics:** marine/fisheries/coastal ecosystem keywords instead of extractive industries

**Target country codes:**
- Vietnam: VN
- Thailand: TH
- Philippines: PH
- Indonesia: ID
- Malaysia: MY
- Myanmar: MM
- Cambodia: KH
- Singapore: SG
- Brunei: BN

### Step 1.2: Brief Section Mapping

Replace Venezuela-focused sections with coastal-marine sections:

| Old Section | New Section | Target Audience |
|---|---|---|
| Extractives & Mining | Marine Security & Governance | Policy makers, defense officials |
| Food & Agriculture | Sustainable Fisheries & Aquaculture | Fishing communities, NGOs |
| Health & Water | Coastal Environmental Health | Health organizations, communities |
| Education & Workforce | Blue Economy & Livelihoods | NGOs, development organizations |
| Finance & Investment | Maritime Trade & Supply Chains | Businesses, traders |
| Cross-cutting / Policy | Climate Change & Resilience | All stakeholders |

---

## 📡 Phase 2: RSS Feeds Adaptation

### Step 2.1: Create `feeds_seasia_coastal.txt`

Replace Venezuela-specific feeds with:

#### Regional News Sources
```
- Bangkok Post – Southeast Asia
- The Straits Times – Asia
- BenarNews (RFA) – Southeast Asia
- ReliefWeb – Southeast Asia Regional
- Google News – Regional updates (per country + topics)
```

#### Marine & Fisheries Focused
```
- FAO (Food & Agriculture Organization) – Fisheries
- IUCN Red List – Marine Conservation
- NewsGuard – Coastal/Maritime news
- ISM (International Seafarers Management) – Port news
- SEAFDEC News – Southeast Asian Fisheries Development Center
```

#### Climate & Environmental
```
- Carbon Brief – Asia Coverage
- Mongabay – Southeast Asia Environmental News
- Down To Earth – Asian Environmental Coverage
- UN News – Regional Environmental Updates
```

#### Maritime & Security
```
- Japan Times – Southeast Asia Regional Security
- Nikkei Asia – Maritime Trade & Security
- Maritime Executive – Southeast Asia Shipping
- Analysis Asia – Regional Security Analysis
- East Asia Forum – Regional Policy
```

---

## 🐍 Phase 3: Python Script Adaptation

### Step 3.1: Create `fetch_news_seasia.py`

**Changes from original:**

```python
# RSS Feed Configuration
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

# Topic Keywords for Filtering
MARINE_TOPICS = [
    "fisheries", "sustainable fishing", "aquaculture",
    "marine security", "maritime", "marine pollution",
    "ocean", "sea level", "coastal erosion",
    "climate change", "marine ecosystem",
    "EEZ", "exclusive economic zone",
    "fishing communities", "blue economy",
    "mangrove", "coral reef", "seagrass"
]

# Output structure
README_PATH = "README_SEASIA_COASTAL.md"
ARCHIVE_PATH = "./data/seasia_coastal/"
```

**New filtering logic:**
- Filter by geographic mentions (country names, provinces)
- Filter by marine/coastal topic keywords
- Prioritize local language sources by country
- Score articles by relevance (topic + geography)

### Step 3.2: Create `fetch_news_seasia.py` (Full Version)

The script will:
1. Fetch feeds for 9 countries
2. Filter articles by marine/coastal relevance
3. De-duplicate across feeds
4. Archive by country + topic
5. Generate country-specific + regional README files

---

## 🔧 Phase 4: Data Structure Adaptation

### Step 4.1: Update JSON Schema

**File:** `data/seasia_coastal/schema.json`

```json
{
  "article": {
    "id": "unique_hash",
    "title": "string",
    "url": "string",
    "published": "ISO8601",
    "source_feed": "string",
    "country_code": "string",
    "topics": ["fisheries", "climate_change", ...],
    "local_language": "string",
    "local_text": "string",
    "relevance_score": 0.0-1.0,
    "geographic_entities": ["province", "city", ...],
    "status": "active|archived|filtered"
  }
}
```

### Step 4.2: Directory Structure

```
data/
  seasia_coastal/
    by_country/
      VN/
        articles.json
        README.md
      TH/
        articles.json
        README.md
      ... (7 more countries)
    by_topic/
      sustainable_fisheries/
        articles.json
      marine_security/
        articles.json
      climate_change/
        articles.json
      marine_pollution/
        articles.json
      coast_resilience/
        articles.json
    regional/
      articles.json
      README_REGIONAL.md
    archive/
      2026-03/
      2026-02/
      ...
```

---

## 📊 Phase 5: Brief Generation Adaptation

### Step 5.1: Create `generateBrief_seasia.js`

**Enhancements over original:**

1. **Multi-language support**
   - Fetch original language content where available
   - Preserve translations for accessibility

2. **Audience-specific briefs**
   - **Community Leaders:** Simple language, local impact focus
   - **Policy Makers:** Governance gaps, transboundary issues
   - **NGOs/Researchers:** Data-driven, evidence links

3. **Topic-specific summaries**
   - Marine Security: Territorial claims, disputes, enforcement
   - Sustainable Fisheries: Stock indicators, management changes
   - Climate Change: Projections, adaptation measures
   - Marine Pollution: Source, impacts, solutions
   - Blue Economy: Opportunities, investments, livelihood info

4. **Geographic briefing**
   - Country-level summaries
   - Transboundary issue detection (South China Sea, Mekong Delta, etc.)
   - Regional synthesis

---

## 🚀 Phase 6: Implementation Checklist

### Step 1: Preparation
- [ ] Review existing config.yml structure
- [ ] Map Venezuela sections to coastal topics
- [ ] Identify target Southeast Asian data sources

### Step 2: Configuration
- [ ] Create `config_seasia_coastal.yml`
- [ ] Create `feeds_seasia_coastal.txt` with real feed URLs
- [ ] Update country/language codes

### Step 3: Backend Scripts
- [ ] Create `fetch_news_seasia.py` (adapted version)
- [ ] Create helper module: `utils_seasia.py` (filtering, scoring, deduplication)
- [ ] Test with sample feeds

### Step 4: Frontend & Briefs
- [ ] Create `generateBrief_seasia.js`
- [ ] Create `generateBrief_country.js` (country-specific summaries)
- [ ] Create audience templates (community/policy/research)

### Step 5: Data & Archive
- [ ] Create directory structure in `data/seasia_coastal/`
- [ ] Create schema.json for new data format
- [ ] Set up archive rotation

### Step 6: Deployment
- [ ] Create GitHub Actions workflow: `.github/workflows/update_seasia_coastal.yml`
- [ ] Schedule: Every 6-12 hours (reduced due to fewer feeds)
- [ ] Set up notifications for critical topics

### Step 7: Documentation
- [ ] Maintain `README_SEASIA_COASTAL.md` with findings
- [ ] Create `TOPICS_GUIDE.md` for interpretation help
- [ ] Create `FEED_SOURCES.md` with feed descriptions

---

## 📝 Sample Configuration Comparison

### Venezuela (Original)
```yaml
country:
  name: "Venezuela"
  iso3: "VEN"
brief_sections:
  - "Extractives & Mining"
  - "Food & Agriculture"
  - "Cross-cutting / Policy / Risk"
```

### Southeast Asia Coastal (New)
```yaml
countries:
  - {name: "Vietnam", iso2: "VN"}
  - {name: "Thailand", iso2: "TH"}
  - {name: "Philippines", iso2: "PH"}
  - (+ 6 more)
brief_sections:
  - "Marine Security & Governance"
  - "Sustainable Fisheries & Aquaculture"
  - "Coastal Environmental Health"
  - "Blue Economy & Livelihoods"
  - "Maritime Climate Change"
  - "Cross-cutting / Regional Policy"
topics:
  - sustainable_fisheries
  - marine_security
  - climate_change_coastal
  - marine_pollution
  - transboundary_issues
```

---

## 🔗 Feed Sources Starting Points

### Recommended RSS Feeds to Research & Add

1. **Vietnam News**
   - VnExpress International
   - Vietnam News Agency (VNA)
   - Tuoi Tre Online

2. **Thailand News**
   - Bangkok Post
   - The Nation Thailand
   - Khaosod English

3. **Philippines News**
   - Philippine News Agency
   - Manila Bulletin
   - Rappler

4. **Indonesia News**
   - Jakarta Post
   - Tempo.co
   - Antaranews

5. **Regional/Marine Specific**
   - SEAFDEC/Aquaculture Dept
   - FAO Info Portal (Asia)
   - IUCN Protected Areas Database
   - BenarNews (RFA)

---

## 📞 Support & Iteration

**For grassroot leaders:**
- Provide simplified, action-oriented summaries
- Include local government contacts/resources
- Flag livelihood threats early
- Highlight adaptation success stories

**For policy makers:**
- Regional trend analysis
- Governance gap identification
- Treaty/agreement status updates

**For researchers/NGOs:**
- Data source attribution
- Methodology documentation
- Longitudinal trend tracking

---

## 🗺️ Geographic Abbreviations

| Country | Code | Capital | Primary Language |
|---------|------|---------|------------------|
| Vietnam | VN | Hanoi | Vietnamese |
| Thailand | TH | Bangkok | Thai |
| Philippines | PH | Manila | Filipino |
| Indonesia | ID | Jakarta | Indonesian |
| Malaysia | MY | Kuala Lumpur | Malay |
| Myanmar | MM | Naypyidaw | Burmese |
| Cambodia | KH | Phnom Penh | Khmer |
| Singapore | SG | Singapore | English |
| Brunei | BN | Bandar Seri Begawan | Malay |

---

## 📚 Resources

- **SEAFDEC:** https://www.seafdec.org/
- **FAO Fisheries:** http://www.fao.org/fishery/
- **IUCN Asia:** https://www.iucn.org/regions/asia
- **Mekong River Commission:** https://www.mrcmekong.org/
- **UN ESCAP:** https://www.unescap.org/

