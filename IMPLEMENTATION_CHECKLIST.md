# Southeast Asia Coastal News System – Implementation Checklist

Use this checklist to implement the adapted news system step-by-step.

---

## 📋 Pre-Implementation (30 min)

- [ ] Review `SEASIA_COASTAL_MIGRATION_GUIDE.md` (main overview)
- [ ] Review `COMPONENT_MAPPING.md` (what changed and why)
- [ ] Read `SEASIA_COASTAL_QUICK_START.md` (execution steps)
- [ ] Understand the Venezuela original system:
  - [ ] `README.md` — What the original does
  - [ ] `config.yml` — How it's configured
  - [ ] `feeds.txt` — Where data comes from
  - [ ] `fetch_news.py` — How articles are fetched
  - [ ] `generateBrief.js` — How summaries are created

---

## 🔧 Environment Setup (20 min)

### Python Environment
- [ ] Python 3.9+ installed
  ```bash
  python3 --version
  ```
- [ ] Verify pip works
  ```bash
  pip3 --version
  ```
- [ ] Install feedparser
  ```bash
  pip3 install feedparser
  ```
- [ ] Test feedparser import
  ```bash
  python3 -c "import feedparser; print('OK')"
  ```

### Node.js Environment
- [ ] Node.js v18+ installed
  ```bash
  node --version
  ```
- [ ] npm works
  ```bash
  npm --version
  ```
- [ ] Create `.env` or export OpenAI key
  ```bash
  export OPENAI_API_KEY="sk-..."
  ```
- [ ] Verify OpenAI SDK can install
  ```bash
  npm install openai --dry-run
  ```

### Git Setup (if using version control)
- [ ] Git initialized or configured
- [ ] Remote repo configured (if pushing)
- [ ] SSH keys set up (optional, for GitHub)

---

## 📁 File Creation & Configuration (45 min)

### Create Configuration Files
- [ ] Create `config_seasia_coastal.yml`
  ```bash
  cp config.yml config_seasia_coastal.yml
  # Then customize with SE Asia countries/topics
  ```
  - [ ] Update country list (9 countries)
  - [ ] Update topic sections (5 topics)
  - [ ] Set appropriate frequency
  - [ ] Configure grassroot_leader_mode: true

- [ ] Create `feeds_seasia_coastal.txt`
  ```bash
  cp feeds.txt feeds_seasia_coastal.txt
  # Then customize with SE Asia feeds
  ```
  - [ ] Add regional aggregators (BenarNews, etc.)
  - [ ] Add fisheries sources (FAO, SEAFDEC, IUCN)
  - [ ] Add climate sources (Carbon Brief, Mongabay)
  - [ ] Add security sources (maritime news)
  - [ ] Add 6+ feeds per country
  - [ ] Verify all URLs are functional

### Create Python Script
- [ ] Create `fetch_news_seasia.py`
  ```bash
  cp fetch_news.py fetch_news_seasia.py
  # Then adapt with country/topic logic
  ```
  - [ ] Define COUNTRIES dictionary (9 countries)
  - [ ] Define MARINE_TOPICS dictionary (5 topics)
  - [ ] Implement `is_relevant()` function
  - [ ] Implement `deduplicate_articles()` function
  - [ ] Implement `organize_by_country()` function
  - [ ] Implement `organize_by_topic()` function
  - [ ] Update feed list to SE Asia feeds
  - [ ] Update output paths to `data/seasia_coastal/`

### Create JavaScript Script
- [ ] Create `generateBrief_seasia.js`
  ```bash
  cp generateBrief.js generateBrief_seasia.js
  # Then adapt with audience/country logic
  ```
  - [ ] Define AUDIENCE_TYPES (grassroot, policy, research)
  - [ ] Define TOPIC_CONTEXT (marine security, fisheries, etc.)
  - [ ] Implement `generateBriefForArticles()` with audience parameter
  - [ ] Implement `generateCountryBriefs()` function
  - [ ] Implement `generateTopicBriefs()` function
  - [ ] Update paths to `data/seasia_coastal/`
  - [ ] Make executable: `chmod +x generateBrief_seasia.js`

### Create Data Schema
- [ ] Create `data/seasia_coastal/schema.json`
  - [ ] Define article object structure
  - [ ] Include country codes, topics, relevance score
  - [ ] Include grassroot-specific fields (action_items, livelihood_impact)
  - [ ] Validate sample article against schema

### Create Supporting Docs
- [ ] Copy all migration docs into repo:
  - [ ] `SEASIA_COASTAL_MIGRATION_GUIDE.md`
  - [ ] `COMPONENT_MAPPING.md`
  - [ ] `SEASIA_COASTAL_QUICK_START.md` (this file)

---

## 🧪 Testing & Validation (60 min)

### Python Fetcher Testing

**Step 1: Basic Syntax Check**
- [ ] No Python syntax errors
  ```bash
  python3 -m py_compile fetch_news_seasia.py
  ```

**Step 2: Test Feed Parsing**
- [ ] Test with 1-2 sample feeds
  ```bash
  python3 -c "
  import feedparser
  url = 'https://www.seafdec.org/feed/'
  result = feedparser.parse(url)
  print(f'Feed entries: {len(result.entries)}')
  for entry in result.entries[:2]:
      print(f'  - {entry.title[:50]}...')
  "
  ```

**Step 3: Create Data Directories**
- [ ] Create directory structure
  ```bash
  mkdir -p data/seasia_coastal/articles_raw
  mkdir -p data/seasia_coastal/by_country/{VN,TH,PH,ID,MY,MM,KH,SG,BN}
  mkdir -p data/seasia_coastal/by_topic
  ```

**Step 4: Test Feed Fetcher with Small Set**
- [ ] Run mini version with 2-3 feeds
- [ ] Check for errors:
  - [ ] No network timeouts
  - [ ] No parsing errors
  - [ ] Relevant articles found

**Step 5: Full Fetcher Run**
- [ ] Run complete fetcher
  ```bash
  python3 fetch_news_seasia.py
  ```
- [ ] Verify outputs:
  - [ ] `README_SEASIA_COASTAL.md` created ✅
  - [ ] `data/seasia_coastal/articles_raw/articles_*.json` created ✅
  - [ ] `data/seasia_coastal/by_country/*/README.md` created ✅
  - [ ] No error messages

**Step 6: Validate Fetcher Output**
- [ ] Check article count: expect 30-50 articles
  ```bash
  python3 -c "
  import json
  with open('data/seasia_coastal/articles_raw/articles_*.json') as f:
    articles = json.load(f)
    print(f'Total articles: {len(articles)}')
    print(f'Countries: {set(a for art in articles for a in art[\"countries\"])}')
    print(f'Topics: {set(t for art in articles for t in art[\"topics\"])}')
  "
  ```
- [ ] Check for duplicates: should be minimal
- [ ] Check for topic assignment: most articles should have 1+ topics
- [ ] Check for country assignment: all should have country codes

**Step 7: Review Generated Digests**
- [ ] Open `README_SEASIA_COASTAL.md` in editor
  - [ ] All sections populated
  - [ ] Links are valid
  - [ ] Timestamps correct
- [ ] Random-check country digests
  ```bash
  cat data/seasia_coastal/by_country/VN/README.md
  cat data/seasia_coastal/by_country/TH/README.md
  ```
  - [ ] Proper country focus
  - [ ] Relevance to coastal issues

---

### JavaScript Brief Generator Testing

**Step 1: Basic Syntax Check**
- [ ] No JavaScript syntax errors
  ```bash
  node --check generateBrief_seasia.js
  ```

**Step 2: Install Dependencies**
- [ ] Install openai SDK
  ```bash
  npm install openai
  ```
- [ ] Verify installation
  ```bash
  ls node_modules/openai
  ```

**Step 3: Environment Setup**
- [ ] OpenAI API key is set
  ```bash
  echo $OPENAI_API_KEY
  ```
- [ ] API key has quota
  ```bash
  # Show first/last 4 chars only
  echo "Key format: ${OPENAI_API_KEY:0:4}...${OPENAI_API_KEY: -4}"
  ```

**Step 4: Test Brief Generator**
- [ ] Run brief generator
  ```bash
  node generateBrief_seasia.js
  ```
- [ ] Expected output:
  - [ ] Loads articles successfully
  - [ ] Generates regional brief
  - [ ] Generates 9 country briefs
  - [ ] Generates 5 topic briefs (optional if limited on API)

**Step 5: Validate Brief Output**
- [ ] Check main brief file created
  ```bash
  cat data/seasia_coastal/BRIEF.json | head -20
  ```
  - [ ] Valid JSON
  - [ ] Contains brief text (not empty)
  - [ ] Generated timestamp exists

- [ ] Check country briefs created
  ```bash
  wc -l data/seasia_coastal/by_country/*/BRIEF.json
  ```
  - [ ] All 9 countries have brief files
  - [ ] Each brief has meaningful content

- [ ] Read sample brief
  ```bash
  jq '.brief' data/seasia_coastal/BRIEF.json
  jq '.brief' data/seasia_coastal/by_country/VN/BRIEF.json
  ```
  - [ ] Briefs are coherent
  - [ ] Language is appropriate for audience
  - [ ] Geographic/topic relevance evident

---

## 📊 Integration Testing (45 min)

### End-to-End Pipeline
- [ ] Run complete pipeline in sequence
  ```bash
  # 1. Fetch news
  python3 fetch_news_seasia.py
  
  # 2. Generate briefs
  node generateBrief_seasia.js
  ```
- [ ] Both scripts complete without errors
- [ ] All output files present
- [ ] No data loss between steps

### Data Consistency
- [ ] Articles in briefs match fetched articles
- [ ] Country assignments match between scripts
- [ ] Topic assignments consistent
- [ ] No articles missing or corrupted

### Performance
- [ ] Fetcher completes in < 5 minutes (with network)
- [ ] Brief generator completes in < 10 minutes (with OpenAI)
- [ ] No memory leaks or hung processes

### Accessibility
- [ ] Markdown files human-readable
- [ ] JSON files valid and parseable
  ```bash
  python3 -c "
  import json
  import glob
  for f in glob.glob('data/seasia_coastal/**/*.json', recursive=True):
    with open(f) as fp:
      json.load(fp)
    print(f'✓ {f}')
  "
  ```

---

## 🚀 Deployment (30 min, optional)

### GitHub Actions (Optional Automation)

- [ ] Create `.github/workflows/update_seasia_coastal.yml`
  - [ ] Schedule: `0 */12 * * *` (every 12 hours)
  - [ ] Add fetch_news_seasia.py step
  - [ ] Add generateBrief_seasia.js step
  - [ ] Add commit-and-push step
  - [ ] Set up OPENAI_API_KEY secret

- [ ] Test workflow manually
  ```bash
  # Simulate: push to feature branch
  git push origin feature/seasia-coastal-news
  ```
  - [ ] Workflow triggers if configured
  - [ ] Completes successfully

- [ ] Merge to main branch
  - [ ] Workflow runs on schedule
  - [ ] Automated commits appear in history

### Manual Scheduling (Alternative)

- [ ] Create cronj entry (Linux/Mac)
  ```bash
  crontab -e
  # Add: 0 */12 * * * cd /path && python3 fetch_news_seasia.py && node generateBrief_seasia.js
  ```
  
- [ ] **OR** Create Windows scheduled task
- [ ] **OR** Document manual run procedure

---

## 📖 Documentation (20 min)

### User Guides
- [ ] Verify `SEASIA_COASTAL_QUICK_START.md` has all steps
- [ ] Add custom sections for your setup:
  - [ ] Server/machine info
  - [ ] Schedule (when updates run)
  - [ ] Access instructions (where files live)
  - [ ] Contact info for support

- [ ] Create README for grassroot leaders
  - [ ] What is this system?
  - [ ] How to use the digests
  - [ ] What topics covered
  - [ ] How to subscribe/access

- [ ] Create README for administrators
  - [ ] How to add new feeds
  - [ ] How to add new countries
  - [ ] How to troubleshoot
  - [ ] Maintenance schedule

### Configuration Documentation
- [ ] Document feed sources used (in `feeds_seasia_coastal.txt`)
- [ ] Document topic definitions (in `config_seasia_coastal.yml`)
- [ ] Document data schema (in `data/seasia_coastal/schema.json`)

---

## 🔍 Quality Assurance (60 min)

### Relevance Checking
- [ ] Spot-check 10 random articles
  - [ ] [ ] Each has relevant country
  - [ ] [ ] Each has relevant topic
  - [ ] [ ] No off-topic articles
  - [ ] [ ] No duplicate articles

### Content Quality
- [ ] Check brief writing quality
  - [ ] [ ] Grammar and spelling
  - [ ] [ ] Factual accuracy
  - [ ] [ ] No hallucinations
  - [ ] [ ] Appropriate tone for audience

### Feed Quality
- [ ] Test each RSS feed URL individually
  - [ ] [ ] No dead links (all 200 status)
  - [ ] [ ] Updated recently (< 7 days old)
  - [ ] [ ] Returns valid XML
  - [ ] [ ] Has multiple entries

- [ ] Remove or replace broken feeds
  - [ ] Update `feeds_seasia_coastal.txt`
  - [ ] Retest affected articles

---

## ✅ Post-Deployment Monitoring (Ongoing)

### Weekly Tasks
- [ ] [ ] Check digest quality (Wednesday)
  - Spot-check regional digest
  - Review one country digest
  - Read sample briefs

- [ ] [ ] Verify feeds are working (Thursday)
  ```bash
  python3 -c "
  import feedparser
  feeds = [...]  # Test key feeds
  for feed_url in feeds:
    result = feedparser.parse(feed_url)
    entries = len(result.entries)
    status = '✓' if entries > 0 else '✗'
    print(f'{status} {feed_url}: {entries} entries')
  "
  ```

### Monthly Tasks
- [ ] First of month: Archive old data
  ```bash
  # Move articles older than 30 days to archive
  ```

- [ ] Mid-month: Collect feedback
  - Email grassroot leaders users
  - Ask: "Was this helpful? Any missing topics?"

- [ ] End of month: Add/remove feeds based on quality
  - Permanently remove dead feeds
  - Add promising new sources
  - Rebalance by country

### Quarterly Tasks (Every 3 months)
- [ ] [ ] Review topic definitions
  - Are keywords still relevant?
  - Should categories be adjusted?

- [ ] [ ] Update country list (if expanding to more countries)
  - Add new feeds
  - Create new country directories

- [ ] [ ] Review audience-specific briefs
  - Ask: Are briefs useful for each audience type?
  - Refine tone/focus if needed

- [ ] [ ] Update documentation
  - Reflect actual usage patterns
  - Document common issues

---

## 🆘 Troubleshooting

### Common Issues & Fixes

**Issue: "No articles found"**
- [ ] Check if feeds are accessible
- [ ] Check if keyword filtering is too strict
- [ ] Increase MAX_ITEMS_PER_FEED temporarily
- [ ] Verify country keywords match article content

**Issue: "OpenAI API Error"**
- [ ] Verify OPENAI_API_KEY is set
- [ ] Check API quotas in OpenAI dashboard
- [ ] Test with curl: `curl https://api.openai.com/v1/models`
- [ ] Fall back to simple synthesis (no OpenAI)

**Issue: "Articles not deduplicating"**
- [ ] Check similarity threshold (currently 85%)
- [ ] Lower to 75% if too many duplicates
- [ ] Review deduplication logic in fetch script

**Issue: "Wrong countries assigned to articles"**
- [ ] Review country keyword list
- [ ] Add more specific terms
- [ ] Manual review of incorrect assignments
- [ ] Update keyword filtering

**Issue: "Scripts hanging/timing out"**
- [ ] Check network connectivity
- [ ] Increase timeout values
- [ ] Run with fewer feeds initially
- [ ] Check system resources (disk space, RAM)

---

## ✨ Success Criteria

### Check These to Confirm Success

- [ ] ✅ Python script runs without errors
- [ ] ✅ ~40+ relevant articles fetched
- [ ] ✅ All 9 countries represented
- [ ] ✅ All 5 topics represented
- [ ] ✅ Deduplication working (no obvious duplicates)
- [ ] ✅ JavaScript brief generator runs
- [ ] ✅ OpenAI briefs generated (or fallback working)
- [ ] ✅ All output files created:
  - [ ] README_SEASIA_COASTAL.md
  - [ ] data/seasia_coastal/BRIEF.json
  - [ ] 9x `by_country/[COUNTRY]/README.md`
  - [ ] 9x `by_country/[COUNTRY]/BRIEF.json`
- [ ] ✅ Content quality verified
- [ ] ✅ Documentation complete
- [ ] ✅ System scheduled (automated or manual)

---

## 📞 Next Steps

Once this checklist is complete:

1. **Engage Users**
   - Share reading guide with grassroot leaders
   - Gather feedback on usefulness
   - Document feature requests

2. **Monitor Quality**
   - Weekly digest spot-checks
   - Feed performance tracking
   - Brief quality assessment

3. **Iterate**
   - Monthly improvements to keywords
   - Quarterly expansion to new countries/topics
   - Annual major review and strategic updates

4. **Share Learning**
   - Document what worked well
   - Write case studies
   - Share with other regional news projects

---

**Saved:** [Configuration files] → `data/seasia_coastal/`
**Status:** Ready for deployment ✨

