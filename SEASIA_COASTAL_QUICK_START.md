# Southeast Asia Coastal News System – Quick Start Implementation

> A step-by-step guide to adapt this Venezuela news aggregator for Southeast Asian coastal communities

---

## 📋 Phase 1: Configuration (15 min)

### ✅ Step 1: Review the Migration Guide
```bash
cat SEASIA_COASTAL_MIGRATION_GUIDE.md
```

**Key files:**
- `config_seasia_coastal.yml` — Regional configuration (9 countries, 5 topics)
- `feeds_seasia_coastal.txt` — RSS feed sources (regional & country-specific)

---

## 🔧 Phase 2: Python Environment Setup (10 min)

### ✅ Step 2: Install Python dependencies

The SE Asia version needs the same dependencies as the original:

```bash
# If not already installed
pip install feedparser
```

**Working dependencies** (from `requirements.txt`):
```
feedparser>=6.0.10
```

✅ Verify:
```bash
python3 -c "import feedparser; print('✅ feedparser OK')"
```

---

## 🐍 Phase 3: Run the Fetcher Script (15 min)

### ✅ Step 3: Make the script executable
```bash
chmod +x fetch_news_seasia.py
```

### ✅ Step 4: First test run
```bash
python3 fetch_news_seasia.py
```

**Expected output:**
```
🌊 Southeast Asia Coastal News Fetcher
==================================================
📡 Fetching BenarNews…
   → Found 3 relevant articles
📡 Fetching The Straits Times…
   → Found 2 relevant articles
   ...
📊 Total articles fetched: 42
✅ After deduplication: 38 unique articles
✅ Regional digest saved to README_SEASIA_COASTAL.md
✅ VN digest saved
✅ TH digest saved
   ... (and more countries)
●
==================================================
✨ Update complete!
   Regional digest: README_SEASIA_COASTAL.md
   Country files: data/seasia_coastal/by_country/
   Archive: data/seasia_coastal/articles_raw/
```

### ✅ Step 5: Check output files
```bash
ls -la README_SEASIA_COASTAL.md
ls -la data/seasia_coastal/
tree data/seasia_coastal/ -L 3
```

---

## 📊 Phase 4: JavaScript Brief Generator (15 min)

### ✅ Step 6: Install Node dependencies

The brief generator uses the same structure as the original but adapted:

```bash
# Make sure Node.js is installed
node --version  # Should be v18+

# Install OpenAI SDK
npm install openai
```

### ✅ Step 7: Set OpenAI API key
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

Or create a `.env` file:
```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

### ✅ Step 8: Run brief generator
```bash
chmod +x generateBrief_seasia.js
node generateBrief_seasia.js
```

**Expected output:**
```
🌊 Southeast Asia Coastal News Brief Generator
==================================================
📂 Loading articles from articles_20260303_131101.json…
✅ Loaded 38 articles

📝 Generating brief for Grassroot Community Leaders…
🌍 Generating country-specific briefs…
  → Generating brief for VN (8 articles)…
  → Generating brief for TH (5 articles)…
   ... (and more countries)
📋 Generating topic-specific briefs…
  → Generating brief for sustainable_fisheries (12 articles)…
  → Generating brief for marine_security (8 articles)…
   ... (and more topics)

✅ Regional brief saved to data/seasia_coastal/BRIEF.json
✅ Brief saved for VN
✅ Brief saved for TH
   ... (and more countries)

==================================================
✨ Brief generation complete!
   Regional: data/seasia_coastal/BRIEF.json
   By Country: data/seasia_coastal/by_country/[COUNTRY]/BRIEF.json
```

---

## 📁 Phase 5: Data Structure Review (5 min)

### ✅ Step 9: Verify directory structure
```bash
tree data/seasia_coastal/ -L 2
```

**Expected structure:**
```
data/seasia_coastal/
├── schema.json                          # Data format definition
├── articles_raw/                        # Archive of raw fetches
│   └── articles_20260303_131101.json
├── BRIEF.json                           # Regional brief
├── by_country/
│   ├── VN/
│   │   ├── README.md                    # Vietnam digest
│   │   └── BRIEF.json                   # Vietnam brief
│   ├── TH/
│   │   ├── README.md
│   │   └── BRIEF.json
│   ... (7 more countries)
└── by_topic/
    └── (topic-organized files, if implemented)
```

### ✅ Step 10: Read the regional digest
```bash
less README_SEASIA_COASTAL.md
```

### ✅ Step 11: Check country briefs
```bash
cat data/seasia_coastal/by_country/VN/README.md
cat data/seasia_coastal/by_country/VN/BRIEF.json | jq .brief
```

---

## 🤖 Phase 6: Automate with GitHub Actions (Optional, 10 min)

### ✅ Step 12: Create workflow file

Create `.github/workflows/update_seasia_coastal.yml`:

```yaml
name: Update Southeast Asia Coastal News

on:
  schedule:
    - cron: '0 */12 * * *'  # Every 12 hours
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Python dependencies
        run: pip install feedparser
      
      - name: Fetch news
        run: python3 fetch_news_seasia.py
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Node dependencies
        run: npm install openai
      
      - name: Generate briefs
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node generateBrief_seasia.js
      
      - name: Commit changes
        run: |
          git config user.name "SEA Coastal News Bot"
          git config user.email "bot@example.com"
          git add -A
          git commit -m "Update SE Asia coastal news digest" || true
          git push
```

---

## 📝 Phase 7: Customization & Migration

### ✅ Step 13: Adapt for your use case

**Update feed URLs:**
```bash
nano feeds_seasia_coastal.txt
# Add/remove specific country feeds
# Adjust frequency based on source availability
```

**Customize topics:**
```bash
nano config_seasia_coastal.yml
# Modify keywords for filtering
# Add new topics relevant to your region
# Customize brief sections
```

**Adjust Python script:**
```bash
nano fetch_news_seasia.py
# Change MAX_ITEMS_PER_FEED (currently 8)
# Modify deduplication threshold (currently 85%)
# Add local language support
```

---

## ✨ Phase 8: Deployment & Maintenance

### ✅ Step 14: Set up repository

```bash
# Initialize git (if needed)
git init
git add SEASIA_COASTAL_MIGRATION_GUIDE.md
git add config_seasia_coastal.yml
git add feeds_seasia_coastal.txt
git add fetch_news_seasia.py
git add generateBrief_seasia.js
git commit -m "Add Southeast Asia coastal news system"
git push
```

### ✅ Step 15: Monitor & iterate

**Weekly tasks:**
- Review feed quality (are sources relevant?)
- Check article relevance (topic matches?)
- Validate country assignment (are geography tags correct?)
- Test brief generation (is tone appropriate?)

**Monthly tasks:**
- Archive older data
- Update feed list
- Review and refine keyword filters
- Collect feedback from grassroot leaders

---

## 🔍 Troubleshooting

### Issue: "No articles found"

**Check feeds:**
```bash
python3 -c "
import feedparser
url = 'https://www.seafdec.org/feed/'
result = feedparser.parse(url)
print(f'Feed entries: {len(result.entries)}')
for entry in result.entries[:3]:
    print(f'  - {entry.title}')
"
```

### Issue: "OpenAI API Error"

```bash
# Verify API key
echo $OPENAI_API_KEY

# Test connection
python3 -c "
from openai import OpenAI
client = OpenAI()
try:
    response = client.chat.completions.create(
        model='gpt-4-turbo',
        messages=[{'role': 'user', 'content': 'Hello'}],
        max_tokens=10
    )
    print('✅ OpenAI OK')
except Exception as e:
    print(f'❌ Error: {e}')
"
```

### Issue: "Articles not deduplicating"

Check the deduplication threshold in `fetch_news_seasia.py`:
```python
# Line ~160
if similarity > 0.85:  # Adjust lower if too strict
    is_duplicate = True
```

---

## 📚 Additional Resources

### Documentation Files
- [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md) — Full implementation details
- [config_seasia_coastal.yml](config_seasia_coastal.yml) — Configuration reference
- [feeds_seasia_coastal.txt](feeds_seasia_coastal.txt) — Feed sources list
- [data/seasia_coastal/schema.json](data/seasia_coastal/schema.json) — Data format spec

### Sample Outputs
After running the scripts, find:
- `README_SEASIA_COASTAL.md` — Regional digest (human-readable)
- `data/seasia_coastal/BRIEF.json` — AI-generated regional brief
- `data/seasia_coastal/by_country/[COUNTRY]/README.md` — Country digests
- `data/seasia_coastal/by_country/[COUNTRY]/BRIEF.json` — Country briefs

### Original Project
- Original: `/README.md` —Venezuela news system
- Original config: `/config.yml`
- Original feeds: `/feeds.txt`
- Original scripts: `/fetch_news.py`, `/generateBrief.js`

---

## 📞 Support

**For issues or improvements:**
1. Check generated diagnostic output in console
2. Review [SEASIA_COASTAL_MIGRATION_GUIDE.md](SEASIA_COASTAL_MIGRATION_GUIDE.md)
3. Examine schema validation in `/data/seasia_coastal/schema.json`
4. Test feed URLs individually with feedparser

---

## ✅ Verification Checklist

- [ ] Reviewed SEASIA_COASTAL_MIGRATION_GUIDE.md
- [ ] Installed feedparser (`pip install feedparser`)
- [ ] Ran `python3 fetch_news_seasia.py` successfully
- [ ] Generated regional digest (README_SEASIA_COASTAL.md)
- [ ] Generated country digests in data/seasia_coastal/by_country/
- [ ] Installed OpenAI SDK (`npm install openai`)
- [ ] Set OPENAI_API_KEY environment variable
- [ ] Ran `node generateBrief_seasia.js` successfully
- [ ] Generated BRIEF.json files
- [ ] Reviewed output quality and relevance
- [ ] Set up GitHub Actions workflow (optional)
- [ ] Tested monitoring and iteration process

---

**Status:** Ready for deployment ✨

