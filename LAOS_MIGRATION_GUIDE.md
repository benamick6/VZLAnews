# Migration Guide: Venezuela → Laos News Intelligence

This guide walks you through adapting the VZLAnews repository to create a Laos-focused news intelligence platform.

---

## Step 1: Create New Repository

1. **On GitHub:**
   - Create new repository: `LaosNews` (or your preferred name)
   - Clone this VZLAnews repository locally
   - Change remote: `git remote set-url origin https://github.com/YOUR_USERNAME/LaosNews.git`

2. **Local setup:**
   ```bash
   git clone https://github.com/marketedgeglobal/VZLAnews.git LaosNews
   cd LaosNews
   git remote set-url origin https://github.com/YOUR_USERNAME/LaosNews.git
   ```

---

## Step 2: Update config.yml

Replace the country section in `config.yml`:

```yaml
# --- Scope / Country Targeting ---
country:
  name: "Laos"
  official_name: "Lao People's Democratic Republic"
  iso2: "LA"
  iso3: "LAO"
  currency_code: "LAK"   # Lao kip
```

### Update country_terms (lines 48-63):

```yaml
country_terms:
  - laos
  - lao
  - "lao pdr"
  - "lao people's democratic republic"
  - vientiane
  - luang prabang
  - pakse
  - savannakhet
  - champasak
  - attapeu
  - mekong
  - "bolikhamxay"
  - "houaphanh"
  - "xieng khouang"
  - "lao government"

geo_context_terms:
  - thailand border
  - vietnam border
  - cambodia border
  - myanmar border
  - china yunnan
  - greater mekong
  - asean
  - "mekong river"
```

### Update sector keywords (lines 71-250):

Keep the sector structure but adjust keywords for Laos context:

**Extractives & Mining:**
```yaml
extractives_mining:
  label: "Extractives & Mining"
  include:
    - mining
    - copper
    - gold
    - bauxite
    - potash
    - "rare earth"
    - "sepon mine"
    - hydropower
    - "nam theun"
    - "don sahong"
    - "xayaburi dam"
    - electricity
    - "power generation"
    - energy
    - "mineral exploration"
    - "mining concession"
```

**Agriculture:**
```yaml
food_agriculture:
  label: "Food & Agriculture"
  include:
    - rice
    - coffee
    - "sticky rice"
    - cassava
    - maize
    - rubber
    - sugarcane
    - plantation
    - "organic farming"
    - livestock
    - fisheries
    - irrigation
    - "food security"
    - aquaculture
    - "agricultural exports"
```

**Finance & Investment:**
```yaml
finance_investment:
  label: "Finance & Investment"
  include:
    - "bank of lao"
    - "bcel bank"
    - "joint development bank"
    - "lao securities exchange"
    - foreign investment
    - fdi
    - "special economic zone"
    - sez
    - "boten-vientiane railway"
    - "china-laos railway"
    - "belt and road"
    - privatization
```

---

## Step 3: Update feeds.txt

Replace ALL feeds with Laos-focused sources. Here's a complete template:

```txt
# ============================
# LAOS – MACRO & POLICY
# ============================

# HIGH-PRIORITY WIRE SERVICES
ReliefWeb – Laos Updates - https://reliefweb.int/country/lao/rss.xml

# Google News English
Google News – Laos economy policy - https://news.google.com/rss/search?q=Laos+economy+policy&hl=en-US&gl=US&ceid=US:en
Google News – Laos government regulation - https://news.google.com/rss/search?q=Laos+government+regulation&hl=en-US&gl=US&ceid=US:en
Google News – Laos infrastructure - https://news.google.com/rss/search?q=Laos+infrastructure+project&hl=en-US&gl=US&ceid=US:en
Google News – Laos investment climate - https://news.google.com/rss/search?q=Laos+investment+climate&hl=en-US&gl=US&ceid=US:en
Google News – Laos China relations - https://news.google.com/rss/search?q=Laos+China+relations+investment&hl=en-US&gl=US&ceid=US:en

Financial Times – Global Economy - https://www.ft.com/global-economy?format=rss
Bloomberg – Politics - https://feeds.bloomberg.com/politics/news.rss

# ============================
# EXTRACTIVES, MINING & ENERGY
# ============================

Google News – Laos mining copper gold - https://news.google.com/rss/search?q=Laos+mining+copper+gold&hl=en-US&gl=US&ceid=US:en
Google News – Laos hydropower dams - https://news.google.com/rss/search?q=Laos+hydropower+dam+electricity&hl=en-US&gl=US&ceid=US:en
Google News – Laos energy projects - https://news.google.com/rss/search?q=Laos+energy+project+power&hl=en-US&gl=US&ceid=US:en
Google News – Laos Nam Theun - https://news.google.com/rss/search?q=Laos+Nam+Theun+hydropower&hl=en-US&gl=US&ceid=US:en
Bing News – Laos mining energy - https://www.bing.com/news/search?q=laos+mining+energy&format=rss

# ============================
# FOOD & AGRICULTURE
# ============================

Google News – Laos agriculture rice coffee - https://news.google.com/rss/search?q=Laos+agriculture+rice+coffee&hl=en-US&gl=US&ceid=US:en
Google News – Laos food security - https://news.google.com/rss/search?q=Laos+food+security+agriculture&hl=en-US&gl=US&ceid=US:en
Bing News – Laos agriculture - https://www.bing.com/news/search?q=laos+agriculture&format=rss
IICA News - https://iica.int/en/rss
FAO News - https://www.fao.org/news/rss-feed/en/

# ============================
# HEALTH & WATER
# ============================

Google News – Laos health system - https://news.google.com/rss/search?q=Laos+health+hospital+medicine&hl=en-US&gl=US&ceid=US:en
Google News – Laos disease outbreak - https://news.google.com/rss/search?q=Laos+dengue+malaria+outbreak&hl=en-US&gl=US&ceid=US:en
Google News – Laos water sanitation - https://news.google.com/rss/search?q=Laos+water+sanitation+mekong&hl=en-US&gl=US&ceid=US:en
Bing News – Laos health water - https://www.bing.com/news/search?q=laos+health+water&format=rss
PAHO News - https://www.paho.org/en/rss.xml
WHO News - https://www.who.int/rss-feeds/news-english.xml

# ============================
# EDUCATION & WORKFORCE
# ============================

Google News – Laos education schools - https://news.google.com/rss/search?q=Laos+education+schools+teachers&hl=en-US&gl=US&ceid=US:en
Google News – Laos university students - https://news.google.com/rss/search?q=Laos+university+students&hl=en-US&gl=US&ceid=US:en
Google News – Laos jobs labor market - https://news.google.com/rss/search?q=Laos+jobs+labor+market&hl=en-US&gl=US&ceid=US:en
Bing News – Laos education workforce - https://www.bing.com/news/search?q=laos+education+workforce&format=rss

# ============================
# FINANCE & INVESTMENT
# ============================

Google News – Laos banking economy - https://news.google.com/rss/search?q=Laos+banking+economy+currency&hl=en-US&gl=US&ceid=US:en
Google News – Laos FDI investment - https://news.google.com/rss/search?q=Laos+investment+FDI+foreign&hl=en-US&gl=US&ceid=US:en
Google News – Laos debt bond - https://news.google.com/rss/search?q=Laos+debt+bonds+loan&hl=en-US&gl=US&ceid=US:en
Google News – Laos SEZ special economic zone - https://news.google.com/rss/search?q=Laos+special+economic+zone+SEZ&hl=en-US&gl=US&ceid=US:en
Google News – Laos China railway BRI - https://news.google.com/rss/search?q=Laos+China+railway+belt+road&hl=en-US&gl=US&ceid=US:en
Bing News – Laos finance investment - https://www.bing.com/news/search?q=laos+finance+investment&format=rss
Bloomberg – Economics - https://feeds.bloomberg.com/economics/news.rss

# ============================
# ENGLISH-LANGUAGE BOOSTER QUERIES
# ============================

Google News – Reuters Laos - https://news.google.com/rss/search?q=site:reuters.com+Laos&hl=en-US&gl=US&ceid=US:en
Google News – AP Laos - https://news.google.com/rss/search?q=site:apnews.com+Laos&hl=en-US&gl=US&ceid=US:en
Google News – Financial Times Laos - https://news.google.com/rss/search?q=site:ft.com+Laos&hl=en-US&gl=US&ceid=US:en
Google News – Bloomberg Laos - https://news.google.com/rss/search?q=site:bloomberg.com+Laos&hl=en-US&gl=US&ceid=US:en
Google News – Reuters Laos economy - https://news.google.com/rss/search?q=site:reuters.com+Laos+economy&hl=en-US&gl=US&ceid=US:en
Google News – AP Laos politics economy - https://news.google.com/rss/search?q=site:apnews.com+Laos+politics+economy&hl=en-US&gl=US&ceid=US:en
Bing News – Reuters Laos - https://www.bing.com/news/search?q=site:reuters.com+laos&format=rss
Bing News – AP Laos - https://www.bing.com/news/search?q=site:apnews.com+laos&format=rss

# ============================
# REGIONAL ENGLISH NEWS OUTLETS
# ============================

The Laotian Times (if RSS available) - [check their website]
Vientiane Times (if RSS available) - [check their website]
Bangkok Post Laos - https://www.bangkokpost.com/search?q=laos&type=rss
The Nation Thailand Laos - https://www.nationthailand.com/search?q=laos&type=rss

# ============================
# PDF / DEEP-DIVE BOOSTER QUERIES
# ============================

Google News – Laos report PDF (2025) - https://news.google.com/rss/search?q=Laos+report+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
Google News – Laos working paper PDF (2025) - https://news.google.com/rss/search?q=Laos+working+paper+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
Google News – IMF Laos PDF (2025) - https://news.google.com/rss/search?q=site:imf.org+Laos+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
Google News – World Bank Laos PDF (2025) - https://news.google.com/rss/search?q=site:worldbank.org+Laos+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
Google News – ADB Laos PDF (2025) - https://news.google.com/rss/search?q=site:adb.org+Laos+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
Google News – ReliefWeb Laos PDF (2025) - https://news.google.com/rss/search?q=site:reliefweb.int+Laos+filetype:pdf+2025&hl=en-US&gl=US&ceid=US:en
```

---

## Step 4: Update README.md

Change the title and description:

```markdown
# 🇱🇦 LaosNews – Latest News from Laos

> Last updated: **[AUTO-GENERATED]**

Automated digest (updated every 6 hours) of news and updates from Laos, aggregated from multiple sources.
```

---

## Step 5: Update scripts/collect_rfps.py

Search for hardcoded "Venezuela" references and update:

**Line 174-199** - Update `_is_venezuela_relevant_entry()`:

```python
def _is_laos_relevant_entry(entry: dict) -> bool:
    # ... same structure ...
    keywords = [
        "laos", "lao", "lao pdr", "vientiane", "luang prabang", 
        "pakse", "savannakhet", "mekong", "lao people's democratic",
        "champasak", "attapeu", "bolikhamxay", "xieng khouang",
    ]
    return any(keyword in text for keyword in keywords)
```

**Line 806** - Update function call:
```python
if _is_global_feed_source(source_url) and not _is_laos_relevant_entry(entry):
```

---

## Step 6: Update GitHub Actions Workflows

In `.github/workflows/*.yml` files, update commit messages:

**update_news.yml:**
```yaml
git commit -m "chore: update Laos news report [skip ci]"
```

**weekly-rfps.yml:**
```yaml
git commit -m "chore: weekly Laos intelligence update [skip ci]"
```

---

## Step 7: Update docs/index.md

Change the page title:

```html
<title>LaosNews Intelligence Platform</title>
<h1>🇱🇦 Laos Intelligence Dashboard</h1>
```

---

## Step 8: Add Laos-specific source weights

In `config.yml`, add regional sources:

```yaml
source_weights:
  "reliefweb.int": 1.4
  "worldbank.org": 1.4
  "imf.org": 1.4
  "adb.org": 1.4        # Asian Development Bank
  "asean.org": 1.3
  "apnews.com": 1.3
  "reuters.com": 1.1
  "ft.com": 1.05
  "bloomberg.com": 1.05
  "bangkokpost.com": 1.2
  "nationthailand.com": 1.15
```

---

## Step 9: Clean and Initialize

```bash
# Clear old data
rm -rf data/*.json data/*.csv

# Create fresh data directory structure
mkdir -p data docs/data

# Initialize with empty data files
echo "[]" > data/articles.json
echo "[]" > data/latest_stories.json
echo "{}" > data/last_run.json

# Commit initial Laos configuration
git add .
git commit -m "Initial commit: Laos news intelligence platform"
git push -u origin main
```

---

## Step 10: Set up GitHub Secrets

If using OpenAI for briefs:
1. Go to repository Settings → Secrets → Actions
2. Add `OPENAI_API_KEY` secret

---

## Step 11: Test Run

```bash
# Test the feed collection
python scripts/collect_rfps.py

# Verify output in docs/data/latest.json
cat docs/data/latest.json | jq '.sectors[0].name'
```

---

## Additional Customizations

### For Lao Language Support

If you want to include Lao language articles, add to `config.yml`:

```yaml
selection:
  min_per_language:
    en: 10
    lo: 5   # Lao language
```

### Regional Asia Focus

Consider adding ASEAN/Mekong region context terms:
- Greater Mekong Subregion (GMS)
- ASEAN Economic Community
- Belt and Road Initiative
- Mekong River Commission

---

## Checklist

- [ ] New repository created
- [ ] config.yml updated with Laos country info
- [ ] config.yml country_terms updated
- [ ] config.yml sector keywords updated for Laos
- [ ] feeds.txt completely replaced with Laos feeds
- [ ] README.md title and description updated
- [ ] scripts/collect_rfps.py function names updated
- [ ] GitHub Actions commit messages updated
- [ ] docs/index.md title updated
- [ ] Source weights adjusted for Asia region
- [ ] Old data files cleared
- [ ] Test run completed successfully
- [ ] GitHub secrets configured (if needed)
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages → Source: main/docs)

---

## Expected Timeline

- Configuration updates: 1-2 hours
- Feed testing and adjustment: 2-3 hours
- First successful run and debugging: 1-2 hours
- Total: 4-7 hours for full migration

---

## Support

The codebase is designed to be country-agnostic. All country-specific logic flows through `config.yml` and `feeds.txt`, so no Python code logic needs changing beyond the function name update.

Good luck with your Laos intelligence platform! 🇱🇦
