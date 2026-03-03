# Southeast Asia Coastal Communities News System
## Complete Migration Package

---

## 📚 Overview

This package adapts the **VZLAnews** (Venezuela news aggregator) into **SEACoastalNews** — a news system for grassroot leaders in Southeast Asia focused on coastal communities.

**Focus Areas:**
- 🐟 Sustainable Fisheries & Aquaculture
- ⚓ Marine Security & Sovereignty
- 🌊 Climate Change & Coastal Resilience
- ♻️ Marine Pollution & Environmental Health
- 💼 Blue Economy & Livelihoods

**Geographic Coverage:** 9 countries (Vietnam, Thailand, Philippines, Indonesia, Malaysia, Myanmar, Cambodia, Singapore, Brunei)

**Target Audiences:**
- Grassroot leaders in fishing communities
- Government policymakers
- NGO researchers and advocates

---

## 📦 Files Included in This Package

### 📖 Documentation (START HERE)

1. **[SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md)** ⭐ **START HERE**
   - Comprehensive overview of the adaptation
   - Explains what changed and why
   - Provides strategic context
   - **Time:** 15 min read

2. **[COMPONENT_MAPPING.md](COMPONENT_MAPPING.md)** — Deep Technical Mapping
   - Maps each component from Venezuela to SE Asia
   - Before/after code examples
   - Explains transformation logic
   - **Time:** 20 min read

3. **[SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md)** — Hands-On Guide
   - Step-by-step execution instructions
   - Terminal commands with expected output
   - Troubleshooting tips
   - **Time:** 30 min hands-on

4. **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** — Detailed Checklist
   - Comprehensive implementation checklist
   - Environmental setup verification
   - Testing procedures
   - Deployment instructions
   - **Time:** 2-3 hours complete implementation

---

### ⚙️ Configuration Files

5. **[config_seasia_coastal.yml](config_seasia_coastal.yml)** — Region Configuration
   - Defines 9 countries and their metadata
   - Specifies 5 topic areas
   - Sets up brief sections for grassroot leaders
   - Configures content filtering and quality controls
   - **Key sections:** countries, topics, brief_sections, content_filtering

6. **[feeds_seasia_coastal.txt](feeds_seasia_coastal.txt)** — News Source Registry
   - 50+ RSS feed URLs organized by region and topic
   - Regional aggregators (BenarNews, East Asia Forum)
   - Marine/fisheries specialists (FAO, SEAFDEC, IUCN)
   - Climate sources (Carbon Brief, Mongabay)
   - Country-specific feeds for all 9 countries
   - **Sections:** Regional, Marine, Climate, Security, South China Sea, By Country

---

### 🐍 Python Scripts (Data Fetching)

7. **[fetch_news_seasia.py](fetch_news_seasia.py)** — Article Fetcher
   - Fetches from 50+ RSS feeds across SE Asia
   - Filters by geographic relevance (9 countries)
   - Filters by marine/coastal topic (5 topics)
   - Removes duplicates (85% title similarity)
   - Scores and tags articles
   - Generates country-specific digests
   - **Output:** README_SEASIA_COASTAL.md + country README files
   - **Runs:** Every 12 hours (scheduled)

---

### 🔧 JavaScript Scripts (Brief Generation)

8. **[generateBrief_seasia.js](generateBrief_seasia.js)** — Brief Generator
   - Uses OpenAI GPT-4 to synthesize articles
   - Generates 3 audience-specific brief versions:
     - Grassroot leaders (action-focused, practical)
     - Policymakers (evidence-based, strategic)
     - Researchers/NGOs (academic, data-driven)
   - Creates country-specific summaries (9x)
   - Creates topic-specific analysis (5x)
   - **Output:** JSON briefs organized by country and topic
   - **Requires:** OPENAI_API_KEY environment variable

---

### 📊 Data & Schema

9. **[data/seasia_coastal/schema.json](data/seasia_coastal/schema.json)** — Data Structure
   - JSON Schema for article objects
   - Defines all article fields and metadata
   - Includes country codes, topics, relevance scores
   - Includes grassroot-specific fields (action_items, livelihood_impact)
   - **Use:** Validate scraped data, document structure

---

## 🚀 Quick Start (5 minutes)

### 1. Read the Migration Guide
```bash
less SEASIA_COASTAL_MIGRATION_GUIDE.md
```
(Press 'q' to quit, Space to scroll)

### 2. Review What's New
```bash
# See the new configuration
cat config_seasia_coastal.yml | head -50

# See the feed sources
head -30 feeds_seasia_coastal.txt
```

### 3. Run the System
```bash
# Fetch news from SE Asia
python3 fetch_news_seasia.py

# Read the results
cat README_SEASIA_COASTAL.md | head -50

# Generate AI briefs (requires OpenAI API key)
export OPENAI_API_KEY="sk-..."
npm install openai
node generateBrief_seasia.js

# View briefs
cat data/seasia_coastal/BRIEF.json | jq .
```

---

## 📋 Implementation Roadmap

### Phase 1: Understanding (Today, 30 min)
- [ ] Read: SEASIA_COASTAL_MIGRATION_GUIDE.md
- [ ] Read: COMPONENT_MAPPING.md
- [ ] Understand: What's different from Venezuela system

### Phase 2: Setup (1 hour)
- [ ] Install Python: `pip install feedparser`
- [ ] Install Node: `npm install openai`
- [ ] Set OpenAI key: `export OPENAI_API_KEY="sk-..."`
- [ ] Create directories: `mkdir -p data/seasia_coastal/{articles_raw,by_country,by_topic}`

### Phase 3: Test (1.5 hours)
- [ ] Run fetcher: `python3 fetch_news_seasia.py`
- [ ] Check output: `ls -la README_SEASIA_COASTAL.md`
- [ ] Run brief generator: `node generateBrief_seasia.js`
- [ ] Validate output: `cat data/seasia_coastal/BRIEF.json`

### Phase 4: Deploy (1 hour)
- [ ] Review IMPLEMENTATION_CHECKLIST.md
- [ ] Set up GitHub Actions (optional automation)
- [ ] Document access for grassroot leaders
- [ ] Schedule updates (every 12 hours)

### Phase 5: Monitor (Ongoing, 30 min/week)
- [ ] Weekly: Check digest quality
- [ ] Monthly: Review feed performance
- [ ] Quarterly: Update keywords/topics
- [ ] Collect user feedback

---

## 🎯 What You Get

### For Grassroot Leaders
- 📰 **Daily regional digest** summarizing coastal news
- 🌍 **9 country-specific digests** with local focus
- 💡 **Practical briefs** highlighting livelihood impacts
- 📍 **Action-oriented summaries** for community leaders

### For Policymakers
- 📊 **Evidence-based briefs** with specific facts
- 🔍 **Governance gap analysis**
- 🌐 **Regional trend identification**
- 📈 **Policy opportunity flagging**

### For Researchers/NGOs
- 🔬 **Academic-style summaries** with nuance
- 📚 **Data source citations**
- 🎯 **Research implications highlighted**
- 📉 **Longitudinal trend tracking**

---

## 📊 System Architecture

```
RSS FEEDS (50+)
   ↓
FETCH_NEWS_SEASIA.PY
  ├─ Geographic filtering (9 countries)
  ├─ Topic filtering (5 topics)
  ├─ Deduplication (85% similarity)
  ├─ Relevance scoring
  └─ Country/topic tagging
   ↓
ARTICLE DATABASE
  ├─ data/seasia_coastal/articles_raw/
  ├─ data/seasia_coastal/by_country/
  └─ data/seasia_coastal/by_topic/
   ↓
GENERATEBRIEF_SEASIA.JS
  ├─ OpenAI GPT-4 synthesis
  ├─ Regional brief
  ├─ Country briefs (9x)
  ├─ Topic briefs (5x)
  └─ Audience-specific versions (3x)
   ↓
OUTPUT
  ├─ README_SEASIA_COASTAL.md (human-readable)
  ├─ BRIEF.json (machine-readable)
  ├─ by_country/[COUNTRY]/README.md (9 files)
  └─ by_country/[COUNTRY]/BRIEF.json (9 files)
```

---

## 🔄 Data Flow

### Article Lifecycle
```
1. RSS Feed → fetched every 12 hours
2. Article → parsed, filtered by country+topic
3. Deduplication → 85% title similarity check
4. Enrichment → country codes, topics, scoring added
5. Archiving → timestamped JSON saved
6. Synthesis → OpenAI brief generation
7. Output → markdown + JSON distributed
8. Access → shared with grassroot leaders
```

---

## 🌍 Geographic Coverage

| Country | Code | Capital | Primary Language | Feed Count |
|---------|------|---------|------------------|-----------|
| Vietnam | VN | Hanoi | Vietnamese | 6+ |
| Thailand | TH | Bangkok | Thai | 6+ |
| Philippines | PH | Manila | Filipino | 6+ |
| Indonesia | ID | Jakarta | Indonesian | 6+ |
| Malaysia | MY | Kuala Lumpur | Malay | 6+ |
| Myanmar | MM | Naypyidaw | Burmese | 5+ |
| Cambodia | KH | Phnom Penh | Khmer | 4+ |
| Singapore | SG | Singapore | English | 4+ |
| Brunei | BN | Bandar Seri Begawan | Malay | 2+ |
| **Regional** | — | — | Multiple | 10+ |

---

## 🎯 Topic Coverage (5 Areas)

1. **Sustainable Fisheries** (sustainable_fisheries)
   - Fish stocks, aquaculture, IUU fishing, fishing communities
   - Audience: Fishing communities, development NGOs

2. **Marine Security** (marine_security)
   - Maritime sovereignty, territorial disputes, South China Sea, piracy
   - Audience: Policymakers, defense officials

3. **Climate & Coastal Change** (climate_coastal)
   - Sea level rise, coastal erosion, adaptation, extreme weather
   - Audience: All stakeholders, especially communities at risk

4. **Marine Pollution** (marine_pollution)
   - Plastic, oil spills, chemical contamination, microplastics
   - Audience: Health organizations, environmental groups

5. **Blue Economy** (blue_economy)
   - Maritime trade, shipping, port development, livelihoods
   - Audience: Businesses, traders, development organizations

---

## 🛠️ Technical Stack

### Requirements
- **Python 3.9+** — Article fetching, filtering
- **Node.js 18+** — Brief generation
- **feedparser** — RSS parsing
- **openai SDK** — GPT-4 integration
- **git** — Version control (optional)

### Optional
- **GitHub Actions** — Scheduled automation
- **Docker** — Container deployment
- **PostgreSQL** — Large-scale archiving

---

## 📝 Key Adaptations from Original

| Aspect | Venezuela | SE Asia Coastal |
|--------|-----------|-----------------|
| **Countries** | 1 (Venezuela) | 9 (SE Asian region) |
| **Topics** | Mining, agriculture, health | Fisheries, marine security, climate, pollution |
| **Filtering** | None → all articles | Topic + country based → high relevance |
| **Output** | Single digest | Regional + 9 country + 5 topic versions |
| **Briefs** | Single version | 3 audience-specific versions |
| **Language** | Spanish/English | English + all 9 local languages |
| **Archiving** | None | Timestamped daily archives |
| **Deduplication** | None | 85% similarity threshold |

---

## 📞 Support & Resources

### Documentation
- Start: [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md)
- Execute: [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md)
- Implement: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
- Understand: [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md)

### External Resources
- **SEAFDEC:** https://www.seafdec.org/
- **FAO Fisheries:** http://www.fao.org/fishery/
- **IUCN:** https://www.iucn.org/
- **Mekong River Commission:** https://www.mrcmekong.org/

---

## ✅ Success Metrics

System is working well when:
- ✅ ~40-60 articles fetched per cycle
- ✅ All 9 countries represented in digests
- ✅ All 5 topics represented in articles
- ✅ <5% duplicate articles
- ✅ Briefs are factual and coherent
- ✅ Grassroot leaders find content useful
- ✅ Policymakers act on insights
- ✅ Researchers cite findings

---

## 🚀 Next Steps

### Immediate (Today)
1. Read SEASIA_COASTAL_MIGRATION_GUIDE.md
2. Review config_seasia_coastal.yml
3. Check feeds_seasia_coastal.txt

### Short-term (This Week)
4. Set up environment (Python + Node)
5. Run fetcher script
6. Generate briefs
7. Test output quality

### Medium-term (This Month)
8. Deploy via GitHub Actions
9. Share with grassroot leaders
10. Collect initial feedback

### Long-term (Ongoing)
11. Monitor feed quality weekly
12. Refine keywords monthly
13. Expand coverage quarterly
14. Annual strategic review

---

## 📜 License & Attribution

This adaptation is based on the VZLAnews project, adapted for Southeast Asian coastal communities. Maintains the same open-source approach to transparent news aggregation.

---

## 💡 Questions?

**Feature Request?**
- Add new country → Modify config + feeds files
- Add new topic → Update keywords in Python script
- Change brief style → Edit audience types in JavaScript
- Add languages → Expand into translation integration

**Problem?**
- Check IMPLEMENTATION_CHECKLIST.md troubleshooting section
- Review console output for error messages
- Verify feeds are accessible (not blocked)
- Test with smaller feed subset

---

## ✨ Ready to Begin?

**Start Here:** [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md)

Then: [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md)

Then: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

**Good luck! 🌊**

