import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ARTICLES_PATH = "./data/articles.json";
const ENRICHED_PATH = "./data/articles_enriched.json";
const BRIEF_PATH = "./data/executiveBrief.json";

async function fetchReadableText(url) {
  try {
    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    const proxyUrl = `https://r.jina.ai/${safeUrl}`;
    const res = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "MarketEdgeNewsBot/1.0 (GitHub Actions)",
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
    return "";
  }
}

function compact(s, maxLen) {
  if (!s) return "";
  const cleaned = String(s).replace(/\s+/g, " ").trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + "…" : cleaned;
}

async function generateBrief() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8"));

  const enriched = [];
  for (const a of articles) {
    const bodyText = await fetchReadableText(a.url);
    enriched.push({
      ...a,
      source: a.source || "",
      extracted_text: bodyText,
      extracted_text_status: bodyText ? "ok" : "fallback_headline_only",
    });
  }

  fs.writeFileSync(ENRICHED_PATH, JSON.stringify(enriched, null, 2));

  const combinedText = enriched
    .map((a, idx) => {
      const header = `ITEM ${idx + 1}: ${a.title} (${a.date || "no date"})`;
      const src = a.url ? `URL: ${a.url}` : "";
      const body =
        a.extracted_text && a.extracted_text_status === "ok"
          ? `CONTENT:\n${compact(a.extracted_text, 4000)}`
          : `CONTENT (fallback):\n${a.title}. ${compact(a.summary || "", 500)}`;
      return `${header}\n${src}\n${body}\n`;
    })
    .join("\n---\n");

  const prompt = `
You are writing a neutral executive brief for an internal policy/BD audience.
Constraints:
- Max 6 sentences total. No bullets.
- No phrases like "recent reporting" or "according to reports."
- Do not reuse the same sentence opening more than once.
- Use specific facts that appear in the CONTENT (numbers, actors, dates, decisions) when available.
- If content is missing for some items, rely on what is available but do not invent details.
- Tone: analytical, concise, non-editorial.

Write the brief now based ONLY on the items below.

${combinedText}
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  let brief = (response.choices?.[0]?.message?.content || "").trim();

  const sentences = brief.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 6) brief = sentences.slice(0, 6).join(" ");

  fs.writeFileSync(BRIEF_PATH, JSON.stringify({ brief }, null, 2));
}

generateBrief().catch((error) => {
  console.error("Failed to generate executive brief:", error);
  process.exit(1);
});
