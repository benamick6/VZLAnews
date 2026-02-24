# Venezuela News Intelligence

<style>
.vzla-page { max-width: 920px; margin: 0 auto; }
.vzla-section { margin-top: 24px; }
.brief-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #f9fafb; }
.news-item { margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #e5e7eb; }
.news-item:last-child { border-bottom: none; }
.news-meta { color: #6b7280; font-size: 13px; }
</style>

<div class="vzla-page">

<section id="executive-brief" class="vzla-section" style="margin-bottom:30px;">
  <h2>Executive Brief</h2>
  <p id="brief-content" class="brief-box">Loading...</p>
</section>

<section class="vzla-section">
  <h2>Latest Articles</h2>
  <div id="news-container">Loading...</div>
</section>

</div>

<script>
function getSourceName(url) {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");

    const sourceMap = {
      "reuters.com": "Reuters",
      "bloomberg.com": "Bloomberg",
      "ft.com": "Financial Times",
      "apnews.com": "Associated Press",
      "el-nacional.com": "El Nacional",
      "wsj.com": "Wall Street Journal",
      "nytimes.com": "New York Times",
      "bbc.com": "BBC",
      "cnn.com": "CNN"
    };

    return sourceMap[hostname] || hostname;
  } catch (e) {
    return "Unknown Source";
  }
}

fetch("{{ '/data/executiveBrief.json' | relative_url }}")
  .then(res => res.json())
  .then(data => {
    const brief = (data && data.brief) ? data.brief : "No executive brief available.";
    document.getElementById("brief-content").innerText = brief;
  })
  .catch(() => {
    document.getElementById("brief-content").innerText = "No executive brief available.";
  });

fetch("{{ '/data/articles.json' | relative_url }}")
  .then(res => res.json())
  .then(articles => {
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    if (!Array.isArray(articles) || articles.length === 0) {
      container.innerText = "No articles available.";
      return;
    }

    articles.forEach(article => {
      const source = getSourceName(article.url);

      const articleElement = document.createElement("div");
      articleElement.className = "news-item";

      articleElement.innerHTML = `
        <h3>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">
            ${article.title}
          </a>
        </h3>
        <p class="news-meta"><strong>${source}</strong> | ${article.date}</p>
      `;

      container.appendChild(articleElement);
    });
  })
  .catch(() => {
    document.getElementById("news-container").innerText = "No articles available.";
  });
</script>
