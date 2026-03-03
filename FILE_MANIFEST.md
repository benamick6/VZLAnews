# 🌊 Southeast Asia Coastal News System – File Manifest

**Created:** March 3, 2026
**Purpose:** Migration guide and implementation package for adapting VZLAnews to Southeast Asian coastal communities

---

## 📂 Files Created

### 📚 Documentation Files (Read These First)

| File | Purpose | Read Time | Priority |
|------|---------|-----------|----------|
| [INDEX_SEASIA_COASTAL.md](INDEX_SEASIA_COASTAL.md) | **START HERE** - Complete overview & index | 10 min | ⭐⭐⭐ |
| [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md) | Comprehensive adaptation guide & strategy | 15 min | ⭐⭐⭐ |
| [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md) | Technical mapping of each component | 20 min | ⭐⭐ |
| [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md) | Hands-on step-by-step execution guide | 30 min | ⭐⭐⭐ |
| [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) | Complete implementation checklist | 60 min | ⭐⭐⭐ |
| **THIS FILE** | File manifest (you are here) | 5 min | ⭐ |

---

### ⚙️ Configuration Files (Customize These)

| File | Purpose | Key Settings |
|------|---------|--------------|
| [config_seasia_coastal.yml](config_seasia_coastal.yml) | Region & topic configuration | 9 countries, 5 topics, 6 brief sections |
| [feeds_seasia_coastal.txt](feeds_seasia_coastal.txt) | RSS feed source registry | 50+ feeds, organized by region/topic |

---

### 🐍 Python Scripts (Run These)

| File | Purpose | Usage |
|------|---------|-------|
| [fetch_news_seasia.py](fetch_news_seasia.py) | Fetch & filter articles from RSS feeds | `python3 fetch_news_seasia.py` |

**Outputs to:**
- `README_SEASIA_COASTAL.md` (regional digest)
- `data/seasia_coastal/articles_raw/` (timestamp archives)
- `data/seasia_coastal/by_country/[COUNTRY]/README.md` (9 country digests)

---

### 🔧 JavaScript Scripts (Run These)

| File | Purpose | Usage |
|------|---------|-------|
| [generateBrief_seasia.js](generateBrief_seasia.js) | Generate AI briefs from articles | `node generateBrief_seasia.js` |

**Requires:** `OPENAI_API_KEY` environment variable
**Outputs to:**
- `data/seasia_coastal/BRIEF.json` (regional brief)
- `data/seasia_coastal/by_country/[COUNTRY]/BRIEF.json` (9 country briefs)

---

### 📊 Data Schema

| File | Purpose | Use |
|------|---------|-----|
| [data/seasia_coastal/schema.json](data/seasia_coastal/schema.json) | JSON Schema for article objects | Validate articles, document format |

---

## 🗂️ Complete Directory Structure

```
VZLAnews/
├── README.md                                (Original Venezuela system)
├── config.yml                               (Original config)
├── feeds.txt                                (Original feeds)
├── fetch_news.py                            (Original Python script)
├── generateBrief.js                         (Original JavaScript)
│
├── 📄 INDEX_SEASIA_COASTAL.md              ← START HERE
├── 📄 SEASIA_COASTAL_MIGRATION_GUIDE.md    ← Read second
├── 📄 COMPONENT_MAPPING.md                 ← Technical details
├── 📄 SEASIA_COASTAL_QUICK_START.md        ← Implementation
├── 📄 IMPLEMENTATION_CHECKLIST.md          ← Detailed checklist
├── 📄 FILE_MANIFEST.md                     ← You are here
│
├── ⚙️ config_seasia_coastal.yml             (NEW: SE Asia config)
├── ⚙️ feeds_seasia_coastal.txt              (NEW: SE Asia feeds)
├── 🐍 fetch_news_seasia.py                  (NEW: SE Asia fetcher)
├── 🔧 generateBrief_seasia.js               (NEW: SE Asia briefs)
│
├── data/
│   └── seasia_coastal/
│       ├── 📊 schema.json                   (NEW: Data format)
│       ├── articles_raw/                    (Output: article archives)
│       ├── by_country/                      (Output: country digests)
│       │   ├── VN/ (Vietnam)
│       │   ├── TH/ (Thailand)
│       │   ├── PH/ (Philippines)
│       │   ├── ID/ (Indonesia)
│       │   ├── MY/ (Malaysia)
│       │   ├── MM/ (Myanmar)
│       │   ├── KH/ (Cambodia)
│       │   ├── SG/ (Singapore)
│       │   └── BN/ (Brunei)
│       └── by_topic/                       (Output: topic summaries)
│           ├── sustainable_fisheries/
│           ├── marine_security/
│           ├── climate_coastal/
│           ├── marine_pollution/
│           └── blue_economy/
│
└── GENERATED OUTPUT FILES:
    ├── README_SEASIA_COASTAL.md             (Regional digest - Markdown)
    └── data/seasia_coastal/
        ├── BRIEF.json                       (Regional brief - JSON)
        ├── by_country/[COUNTRY]/README.md   (Country digest - Markdown)
        └── by_country/[COUNTRY]/BRIEF.json  (Country brief - JSON)
```

---

## 🎯 How to Use This Package

### Option 1: Quick Implementation (Fastest)
1. Read: [INDEX_SEASIA_COASTAL.md](INDEX_SEASIA_COASTAL.md) (10 min)
2. Read: [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md) (15 min)
3. Execute: Follow terminal commands (30 min)
4. Done!

### Option 2: Thorough Understanding (Best)
1. Read: [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md) (15 min)
2. Read: [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md) (20 min)
3. Read: [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md) (15 min)
4. Execute: Follow checklist in [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) (90 min)
5. Done!

### Option 3: Reference Material (For Later)
- Keep [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md) handy for troubleshooting
- Use [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) for maintenance
- Refer to [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md) when customizing

---

## 📋 Reading Order

```
START HERE
    ↓
INDEX_SEASIA_COASTAL.md (10 min)
    │
    ├─→ SEASIA_COASTAL_MIGRATION_GUIDE.md (15 min) [Why & What]
    │   └─→ COMPONENT_MAPPING.md (20 min) [How (technical)]
    │
    ├─→ SEASIA_COASTAL_QUICK_START.md (30 min) [Let's do it]
    │   └─→ IMPLEMENTATION_CHECKLIST.md (60 min) [Complete info]
    │
    └─→ Try the scripts!
        python3 fetch_news_seasia.py
        node generateBrief_seasia.js
```

---

## 🔑 Key Files to edit if Customizing

| Need | File | Section | Effort |
|------|------|---------|--------|
| Add new country | `config_seasia_coastal.yml` | `countries:` | Low |
| Add new topic | `config_seasia_coastal.yml` | `topics:` | Low |
| Change feeds | `feeds_seasia_coastal.txt` | Any section | Low |
| Modify filtering | `fetch_news_seasia.py` | `is_relevant()` | Medium |
| Change brief tone | `generateBrief_seasia.js` | `AUDIENCE_TYPES` | Medium |
| Add new output | `fetch_news_seasia.py` or `generateBrief_seasia.js` | Output functions | High |

---

## ✅ Pre-Flight Checks

Before you start, verify you have:

- [ ] Python 3.9+
- [ ] Node.js 18+
- [ ] `feedparser` library
- [ ] `openai` SDK
- [ ] OpenAI API key
- [ ] ~500MB disk space for archives
- [ ] Internet connection for RSS feeds

---

## 📚 What Each File Does

### Documentation

**INDEX_SEASIA_COASTAL.md** 
- Purpose: Complete overview and navigation center
- Read if: You need to understand the whole system at once
- Time: 10 minutes

**SEASIA_COASTAL_MIGRATION_GUIDE.md**
- Purpose: Strategic guide explaining what changed and why
- Read if: You want to understand the transformation
- Time: 15 minutes

**COMPONENT_MAPPING.md**
- Purpose: Technical mapping showing exact changes
- Read if: You want detailed technical understanding
- Time: 20 minutes

**SEASIA_COASTAL_QUICK_START.md**
- Purpose: Step-by-step execution guide with terminal commands
- Read if: You want to set it up right now
- Time: 30 minutes, then 90 minutes to execute

**IMPLEMENTATION_CHECKLIST.md**
- Purpose: Comprehensive checklist for complete implementation
- Read if: You want to do this thoroughly
- Time: 60 minutes reading + 2-3 hours implementation

**FILE_MANIFEST.md** (this file)
- Purpose: Index of all files and where to find them
- Read if: You're looking for specific information
- Time: 5 minutes

### Configuration

**config_seasia_coastal.yml**
- Controls: Countries, topics, brief sections, filtering rules
- Edit: To add countries, topics, or change output frequency
- Default: Set for 9 SE Asian countries, 5 marine topics

**feeds_seasia_coastal.txt**
- Controls: Where articles are fetched from
- Edit: To add/remove news sources
- Default: 50+ regional and country-specific RSS feeds

### Scripts

**fetch_news_seasia.py**
- Runs: `python3 fetch_news_seasia.py`
- Does: Fetches RSS → filters → deduplicates → organizes
- Output: Articles, digests, country summaries
- Run frequency: Every 12 hours

**generateBrief_seasia.js**
- Runs: `node generateBrief_seasia.js`
- Does: Uses OpenAI GPT-4 to synthesize articles
- Output: Brief summaries for different audiences
- Run frequency: After fetcher runs
- Requires: OPENAI_API_KEY environment variable

### Data Schema

**data/seasia_coastal/schema.json**
- Defines: Structure of article objects in JSON
- Use: Validate articles, document format, type checking
- Reference: When creating articles or debugging data

---

## 🚀 Quick Start Command

Copy and paste to get started immediately:

```bash
# 1. Read the overview (5 min)
cat INDEX_SEASIA_COASTAL.md

# 2. Read the quick start (5 min)
cat SEASIA_COASTAL_QUICK_START.md

# 3. Check environment
python3 --version  # Need 3.9+
node --version     # Need 18+

# 4. Install dependencies
pip3 install feedparser
npm install openai

# 5. Create directories
mkdir -p data/seasia_coastal/{articles_raw,by_country,by_topic}

# 6. Run the fetcher
python3 fetch_news_seasia.py

# 7. Check results
cat README_SEASIA_COASTAL.md | head -20

# 8. Set your OpenAI API key
export OPENAI_API_KEY="sk-..."

# 9. Generate briefs (requires OpenAI key)
node generateBrief_seasia.js

# 10. Review output
cat data/seasia_coastal/BRIEF.json | jq . | head -50
```

---

## 📞 How to Get Help

1. **Script won't run?**
   - Check: [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md) → Troubleshooting section
   - Check: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) → Troubleshooting section

2. **Want to understand how it works?**
   - Read: [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md)

3. **Need to set it up from scratch?**
   - Follow: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

4. **Want to customize it?**
   - Review: What you want to change in the files above
   - Edit: The appropriate configuration or script file

---

## 📊 File Statistics

| Category | Files | Content |
|----------|-------|---------|
| Documentation | 6 | ~15,000 words |
| Configuration | 2 | ~500 lines |
| Python Scripts | 1 | ~400 lines |
| JavaScript Scripts | 1 | ~300 lines |
| Data Schema | 1 | ~150 lines |
| **Total** | **11** | **~16,000 lines** |

---

## ✨ You're Ready!

All files are prepared. Choose your path:

- **🏃 Fast Track** → [SEASIA_COASTAL_QUICK_START.md](SEASIA_COASTAL_QUICK_START.md)
- **🎓 Full Learning** → [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md)
- **✅ Checklist Mode** → [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

Good luck! 🌊

