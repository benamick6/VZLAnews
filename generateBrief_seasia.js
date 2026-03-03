#!/usr/bin/env node

/**
 * Generate brief summaries for Southeast Asia coastal news
 * Adapted for grassroot leaders in coastal communities
 * Focus: sustainable fisheries, climate change, marine security, pollution
 */

import fs from "fs";
import path from "path";

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
let openai = null;

async function ensureOpenAIClient() {
  if (!hasOpenAIKey) return null;
  if (openai) return openai;

  try {
    const { default: OpenAI } = await import("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai;
  } catch (error) {
    console.warn(
      "⚠️  OpenAI package not installed; using deterministic local summaries."
    );
    return null;
  }
}

const ARTICLES_PATH = "./data/seasia_coastal/articles_raw";
const BRIEF_OUTPUT = "./data/seasia_coastal/BRIEF.json";
const BRIEF_BY_COUNTRY_DIR = "./data/seasia_coastal/by_country";

const AUDIENCE_TYPES = {
  grassroot_leader: {
    name: "Grassroot Community Leaders",
    tone: "practical, action-focused, accessible",
    length: "4-5 sentences",
    focus: "livelihood impacts, local action items, community resources",
  },
  policymaker: {
    name: "Policy Makers & Government Officials",
    tone: "analytical, evidence-based, strategic",
    length: "5-6 sentences",
    focus: "governance gaps, policy recommendations, enforcement needs",
  },
  researcher_ngo: {
    name: "Researchers & NGO Leaders",
    tone: "academic, data-driven, comprehensive",
    length: "6-7 sentences",
    focus: "evidence base, methodology, causality, research implications",
  },
};

const TOPIC_CONTEXT = {
  sustainable_fisheries: {
    summary: "Sustainable fishing practices, stock management, aquaculture",
    prompts:
      "What are the fisheries management implications? What impacts livelihoods?",
  },
  marine_security: {
    summary: "Maritime sovereignty, territorial disputes, marine enforcement",
    prompts:
      "How does this affect regional stability? What are enforcement gaps?",
  },
  climate_coastal: {
    summary: "Sea level rise, coastal adaptation, extreme weather impacts",
    prompts:
      "What vulnerabilities does this reveal? What adaptation is needed?",
  },
  marine_pollution: {
    summary: "Ocean plastic, chemical/oil spills, ecosystem contamination",
    prompts:
      "What is the source? What supports cleanup/prevention? Health impacts?",
  },
  blue_economy: {
    summary: "Maritime trade, shipping, livelihood opportunities, supply chains",
    prompts:
      "What economic opportunities exist? What are market risks? Livelihood prospects?",
  },
};

async function fetchReadableText(url) {
  /**
   * Extract full text from article URL using Jina AI reader
   */
  try {
    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    const proxyUrl = `https://r.jina.ai/${safeUrl}`;

    const res = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "SEACoastalNewsBot/1.0 (GitHub Actions)",
      },
    });

    if (!res.ok) return "";

    const text = await res.text();
    const cleaned = text
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .trim();

    if (cleaned.length < 800) return "";
    return cleaned.slice(0, 4000);
  } catch (e) {
    console.error(`❌ Failed to fetch ${url}: ${e.message}`);
    return "";
  }
}

function compact(s, maxLen) {
  /**
   * Compact string to max length with ellipsis
   */
  if (!s) return "";
  const cleaned = String(s).replace(/\s+/g, " ").trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + "…" : cleaned;
}

function buildFallbackBrief(articles, audienceInfo) {
  if (!articles || articles.length === 0) {
    return "No relevant coastal updates were available in this run.";
  }

  const uniqueTopics = [
    ...new Set(articles.flatMap((a) => a.topics || [])),
  ];
  const uniqueCountries = [
    ...new Set(articles.flatMap((a) => a.countries || [])),
  ];
  const uniqueSources = [
    ...new Set(articles.map((a) => a.source || "Unknown source")),
  ];

  const topicText = uniqueTopics.length
    ? uniqueTopics.join(", ")
    : "coastal community developments";
  const countryText = uniqueCountries.length
    ? uniqueCountries.join(", ")
    : "multiple Southeast Asian locations";

  return [
    `${articles.length} relevant items were identified for ${audienceInfo.name.toLowerCase()}.`,
    `Coverage centers on ${topicText}.`,
    `Geographic focus includes ${countryText}.`,
    `Primary sources include ${uniqueSources.slice(0, 4).join(", ")}.`,
    "Specific operational details remain limited in several articles; details pending where source text is thin.",
  ].join(" ");
}

async function generateBriefForArticles(articles, audience = "grassroot_leader") {
  /**
   * Generate brief summary for a collection of articles
   */
  const audience_info = AUDIENCE_TYPES[audience];

  if (!audience_info) {
    throw new Error(`Unknown audience: ${audience}`);
  }

  console.log(`\n📝 Generating brief for ${audience_info.name}…`);

  // Prepare article summaries
  const articleSummaries = articles
    .map((a, idx) => {
      const topicList = (a.topics || []).join(", ") || "unspecified";
      const countryList = (a.countries || []).join(", ") || "regional";
      const header = `ARTICLE ${idx + 1}: "${a.title}"`;
      const meta = `Topic: ${topicList} | Countries: ${countryList} | Source: ${a.source}`;
      const url = `URL: ${a.url}`;
      const summary = `Summary: ${a.summary || a.title}`;

      return `${header}\n${meta}\n${url}\n${summary}`;
    })
    .join("\n\n---\n\n");

  // Build contextual prompt based on audience
  let prompt = `You are creating an executive brief for: ${audience_info.name}

## Constraints for This Brief:
- Tone: ${audience_info.tone}
- Length: ${audience_info.length}, max 8 sentences
- Focus: ${audience_info.focus}
- NO generic phrases like "recent reporting" or "according to reports"
- Use SPECIFIC facts: numbers, dates, places, organizations, decisions
- Avoid repeating sentence structures
- If specific data is missing, say "details pending" rather than speculate

## Articles to Synthesize:

${articleSummaries}

## Output Format:
Provide ONLY the brief text. No labels, no commentary. Pure synthesis.

Now write the brief:`;

  try {
    const openaiClient = await ensureOpenAIClient();
    if (!openaiClient) {
      return buildFallbackBrief(articles, audience_info);
    }

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return (response.choices?.[0]?.message?.content || "").trim();
  } catch (e) {
    console.error(`❌ OpenAI error: ${e.message}`);
    return buildFallbackBrief(articles, audience_info);
  }
}

async function generateCountryBriefs(articles) {
  /**
   * Generate country-specific briefs
   */
  const byCountry = {};

  // Group articles by country
  for (const article of articles) {
    for (const country of article.countries) {
      if (!byCountry[country]) byCountry[country] = [];
      byCountry[country].push(article);
    }
  }

  console.log("\n🌍 Generating country-specific briefs…");

  const briefsByCountry = {};

  for (const [country, countryArticles] of Object.entries(byCountry)) {
    if (countryArticles.length === 0) continue;

    console.log(`  → Generating brief for ${country} (${countryArticles.length} articles)…`);

    const brief = await generateBriefForArticles(
      countryArticles.slice(0, 10),
      "grassroot_leader"
    );

    briefsByCountry[country] = {
      country,
      article_count: countryArticles.length,
      topics: [...new Set(countryArticles.flatMap((a) => a.topics))],
      brief,
      generated_at: new Date().toISOString(),
    };

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return briefsByCountry;
}

async function generateTopicBriefs(articles) {
  /**
   * Generate topic-specific briefs
   */
  const byTopic = {};

  // Group articles by topic
  for (const article of articles) {
    for (const topic of article.topics) {
      if (!byTopic[topic]) byTopic[topic] = [];
      byTopic[topic].push(article);
    }
  }

  console.log("\n📋 Generating topic-specific briefs…");

  const briefsByTopic = {};

  for (const [topic, topicArticles] of Object.entries(byTopic)) {
    if (topicArticles.length === 0) continue;

    console.log(
      `  → Generating brief for ${topic} (${topicArticles.length} articles)…`
    );

    const topicInfo = TOPIC_CONTEXT[topic] || {
      summary: "Emerging coastal issue",
      prompts: "Assess implications and local impacts.",
    };
    const brief = await generateBriefForArticles(
      topicArticles.slice(0, 10),
      "researcher_ngo"
    );

    briefsByTopic[topic] = {
      topic,
      description: topicInfo.summary,
      article_count: topicArticles.length,
      countries: [...new Set(topicArticles.flatMap((a) => a.countries))],
      brief,
      generated_at: new Date().toISOString(),
    };

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return briefsByTopic;
}

async function loadLatestArticles() {
  /**
   * Load the most recent articles JSON from archive
   */
  try {
    const files = fs
      .readdirSync(ARTICLES_PATH)
      .filter((f) => f.startsWith("articles_") && f.endsWith(".json"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error("❌ No article files found!");
      return [];
    }

    const latestFile = path.join(ARTICLES_PATH, files[0]);
    console.log(`📂 Loading articles from ${files[0]}…`);

    const data = JSON.parse(fs.readFileSync(latestFile, "utf8"));
    console.log(`✅ Loaded ${data.length} articles`);

    return data;
  } catch (e) {
    console.error(`❌ Error loading articles: ${e.message}`);
    return [];
  }
}

async function main() {
  console.log("🌊 Southeast Asia Coastal News Brief Generator");
  console.log("=".repeat(50));

  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "⚠️  OPENAI_API_KEY not set. Skipping OpenAI-based briefs."
    );
    console.warn("   Using deterministic local fallback summaries.");
  }

  // Load articles
  const articles = await loadLatestArticles();

  if (articles.length === 0) {
    console.error("❌ No articles to process");
    process.exit(1);
  }

  // Generate briefs
  const regionalBrief = await generateBriefForArticles(
    articles.slice(0, 15),
    "grassroot_leader"
  );
  const countryBriefs = await generateCountryBriefs(articles);
  const topicBriefs = await generateTopicBriefs(articles);

  // Compile output
  const output = {
    generated_at: new Date().toISOString(),
    total_articles: articles.length,
    regional_brief: regionalBrief,
    country_briefs: countryBriefs,
    topic_briefs: topicBriefs,
  };

  // Save briefs
  fs.writeFileSync(BRIEF_OUTPUT, JSON.stringify(output, null, 2));
  console.log(`\n✅ Regional brief saved to ${BRIEF_OUTPUT}`);

  // Save country briefs as individual files
  for (const [country, brief] of Object.entries(countryBriefs)) {
    const countryDir = path.join(BRIEF_BY_COUNTRY_DIR, country);
    fs.mkdirSync(countryDir, { recursive: true });

    const briefPath = path.join(countryDir, "BRIEF.json");
    fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2));
    console.log(`✅ Brief saved for ${country}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✨ Brief generation complete!");
  console.log(`   Regional: ${BRIEF_OUTPUT}`);
  console.log(`   By Country: ${BRIEF_BY_COUNTRY_DIR}/[COUNTRY]/BRIEF.json`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
