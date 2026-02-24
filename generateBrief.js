const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBrief() {
  const raw = fs.readFileSync("./data/articles.json", "utf8");
  const articles = JSON.parse(raw);

  const combinedText = articles
    .map((a) => `${a.title}. ${a.summary || ""}`)
    .join("\n");

  const prompt = `
Write a neutral executive brief (maximum 6 sentences) summarizing the following news items.
Tone: analytical, policy-focused, concise.
No speculation. No dramatic language.
Focus on political, economic, infrastructure, and geopolitical implications.

News:
${combinedText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const brief = (response.choices?.[0]?.message?.content || "Loading...").trim();

  fs.writeFileSync(
    "./data/executiveBrief.json",
    JSON.stringify({ brief }, null, 2)
  );
}

generateBrief().catch((error) => {
  console.error("Failed to generate executive brief:", error);
  process.exit(1);
});
