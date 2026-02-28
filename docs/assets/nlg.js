function seededRand(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function () {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function clampText(s, max = 180) {
  if (!s) return "";
  const clean = String(s).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

function stripBoilerplate(snippet) {
  if (!snippet) return { text: "", isTemplate: false };
  const s = snippet.replace(/\s+/g, " ").trim();

  const boilerplatePatterns = [
    /Comprehensive up-?to-?date news coverage/i,
    /Read.*latest.*news/i,
    /Click.*for full coverage/i,
    /This is a summary of/i,
  ];

  const isTemplate = boilerplatePatterns.some((re) => re.test(s));
  if (isTemplate) {
    return {
      text: "Open the source for details; the feed produced a generic summary.",
      isTemplate: true,
    };
  }

  const cleaned = s
    .replace(/\b(Read more|Continue reading|See more)\b.*$/i, "")
    .trim();

  return { text: cleaned, isTemplate: false };
}

function synthWhy(item) {
  const rng = seededRand(item.id || item.url || item.title || "seed");
  const sector = (item.sector || "").toLowerCase();
  const hasRisk = !!(item.flags && item.flags.risk);
  const hasOpp = !!(item.flags && item.flags.opportunity);

  const lensBySector = {
    "extractives & mining": ["contract risk", "export volumes", "sanctions exposure", "cash-flow reliability", "field operations"],
    "finance & investment": ["capital controls", "FX access", "payment risk", "sovereign exposure", "counterparty risk"],
    "governance & politics": ["policy continuity", "rule-of-law signals", "election pathway", "security conditions", "regulatory enforcement"],
    "food & agriculture": ["import dependency", "price pressure", "supply stability", "rural livelihoods", "food security"],
    "health & water": ["service continuity", "infrastructure reliability", "donor access", "public health risk", "operational constraints"],
    "education & workforce": ["labor supply", "migration pressure", "human capital", "service delivery", "social stability"],
  };

  const sectorLenses = lensBySector[item.sector] || lensBySector[sector] || [
    "policy risk",
    "operational risk",
    "market access",
    "reputational exposure",
    "timeline uncertainty",
  ];

  const lens = pick(rng, sectorLenses);

  const openers = [
    "Watch this for",
    "This shifts the picture on",
    "Net effect:",
    "The immediate signal relates to",
    "This lands as a material update on",
    "For decision-makers, the key angle is",
  ];

  const riskPhrases = [
    "risk tightens around",
    "downside pressure increases on",
    "exposure rises for",
    "compliance sensitivity increases for",
    "volatility likely increases around",
  ];

  const oppPhrases = [
    "a window opens for",
    "conditions improve for",
    "near-term upside emerges in",
    "space widens for",
    "momentum builds behind",
  ];

  const neutralPhrases = [
    "the main implication sits in",
    "attention should stay on",
    "this connects most directly to",
    "the key dependency remains",
    "the next-order effect hits",
  ];

  let verbPhrase;
  if (hasRisk) verbPhrase = pick(rng, riskPhrases);
  else if (hasOpp) verbPhrase = pick(rng, oppPhrases);
  else verbPhrase = pick(rng, neutralPhrases);

  const template = `${pick(rng, openers)} ${lens}; ${verbPhrase} near-term positioning.`;
  return clampText(template, 120);
}

function synthOneLiner(item) {
  const rng = seededRand((item.id || "") + "|oneLiner");
  const date = item.dateISO ? item.dateISO.slice(0, 10) : "";
  const pub = item.publisher || item.domain || "Source";

  const patterns = [
    () => `${pub} reports a ${item.flags?.risk ? "risk" : item.flags?.opportunity ? "tailwind" : "notable"} update${date ? " (dated " + date + ")" : ""}.`,
    () => `${date ? date + ":" : "Update:"} ${item.flags?.risk ? "risk edges up" : item.flags?.opportunity ? "opportunity improves" : "signal worth tracking"}.`,
    () => `A fresh data point from ${pub} changes the near-term read.`,
    () => `This item matters less for the headline and more for the second-order effects.`,
  ];

  return clampText(pick(rng, patterns)(), 140);
}

function synthText(item) {
  const { text: cleanedSnippet, isTemplate } = stripBoilerplate(item.snippet || "");
  const snippet = clampText(cleanedSnippet, 180);

  const why = item.why ? clampText(item.why, 120) : synthWhy(item);

  const toneBadges = [];
  if (isTemplate) toneBadges.push("Template summary");
  if (item.flags?.risk) toneBadges.push("Risk");
  if (item.flags?.opportunity) toneBadges.push("Opportunity");
  if (item.confidence) toneBadges.push(String(item.confidence));

  return { snippet, why, toneBadges, oneLiner: synthOneLiner(item) };
}

function readItemFromCard(card) {
  return {
    id: card.dataset.itemId || "",
    url: card.dataset.itemUrl || "",
    title: card.dataset.itemTitle || "",
    sector: card.dataset.itemSector || card.dataset.sector || "",
    snippet: card.dataset.itemSnippet || "",
    why: card.dataset.itemWhy || "",
    dateISO: card.dataset.itemDateiso || "",
    publisher: card.dataset.itemPublisher || "",
    confidence: card.dataset.itemConfidence || card.dataset.confidence || "",
    flags: {
      risk: card.dataset.itemFlagRisk === "1",
      opportunity: card.dataset.itemFlagOpportunity === "1",
    },
  };
}

function renderToneBadges(container, badges) {
  if (!container) return;
  container.innerHTML = "";
  badges.forEach((badge) => {
    const el = document.createElement("span");
    el.className = "tone-badge";
    el.textContent = badge;
    container.appendChild(el);
  });
}

function enhanceNlgCards() {
  const cards = Array.from(document.querySelectorAll(".story-card"));
  cards.forEach((card) => {
    const item = readItemFromCard(card);
    const result = synthText(item);

    const oneLinerNode = card.querySelector('[data-role="one-liner"]');
    if (oneLinerNode) {
      oneLinerNode.textContent = result.oneLiner || "";
      oneLinerNode.style.display = result.oneLiner ? "block" : "none";
    }

    const snippetNode = card.querySelector(".story-summary");
    if (snippetNode && result.snippet) {
      snippetNode.textContent = result.snippet;
    }

    const whyNode = card.querySelector(".story-why");
    if (whyNode && result.why) {
      whyNode.textContent = result.why;
    }

    const badgeContainer = card.querySelector('[data-role="tone-badges"]');
    renderToneBadges(badgeContainer, result.toneBadges || []);
  });
}

window.synthText = synthText;
window.enhanceNlgCards = enhanceNlgCards;
