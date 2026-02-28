(function () {
    async function loadJson(path) {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load ' + path);
        return response.json();
    }

    function esc(value) {
        return String(value || '').replace(/[&<>"']/g, (char) => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char
        ));
    }

    function detectLanguage(item) {
        const declared = (item && item.language ? String(item.language) : '').toLowerCase();
        return (declared === 'es' || declared === 'en') ? declared : 'other';
    }

    function normalizePreview(text) {
        const clean = String(text || '').replace(/\s+/g, ' ').trim();
        if (!clean) return '';
        const parts = clean.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/).map((s) => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
            const two = `${parts[0]} ${parts[1]}`.trim();
            if (two.length > 360) return '';
            return two;
        }
        if (clean.length >= 90 && clean.length <= 360) {
            return clean;
        }
        return '';
    }

    function isArticleUrl(rawUrl) {
        if (!rawUrl) return false;
        let parsed;
        try {
            parsed = new URL(rawUrl);
        } catch {
            return false;
        }
        const path = (parsed.pathname || '').toLowerCase();
        const badExact = new Set(['', '/', '/en', '/es', '/news', '/en/news', '/en/news/', '/rss', '/rss.xml', '/feed', '/feeds', '/home']);
        if (badExact.has(path)) return false;
        const badStarts = ['/rss', '/feed', '/feeds', '/topic/', '/topics/', '/category/', '/categories/', '/country/', '/countries/', '/about', '/search', '/sitemap'];
        if (badStarts.some((prefix) => path.startsWith(prefix))) return false;
        const segments = path.split('/').filter(Boolean);
        if (segments.length < 2) return false;
        const hasDate = /\b20\d{2}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\b/.test(path)
            || /\b20\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])\b/.test(path);
        const last = segments[segments.length - 1] || '';
        const hasLongSlug = last.length >= 12 && !last.endsWith('.xml');
        const goodPrefixes = ['/publication', '/publications', '/report', '/reports', '/document', '/documents', '/press-release', '/press-releases', '/news/story', '/news/feature', '/resources', '/library'];
        const hasGoodPrefix = goodPrefixes.some((prefix) => path.startsWith(prefix));
        return hasDate || hasLongSlug || hasGoodPrefix;
    }

    function renderLanguageSwitcher(activeLanguage) {
        return `
            <section class="panel language-panel">
                <div class="language-switch" role="group" aria-label="Language filter">
                    <button class="lang-btn ${activeLanguage === 'en' ? 'active' : ''}" data-lang="en" type="button">English</button>
                    <button class="lang-btn ${activeLanguage === 'es' ? 'active' : ''}" data-lang="es" type="button">Español</button>
                </div>
            </section>
        `;
    }

    async function loadIMF() {
        try {
            return await loadJson('data/imf_ven.json');
        } catch {
            return null;
        }
    }

    function fmt(value, unit) {
        if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
        const numeric = Number(value);
        const absValue = Math.abs(numeric);
        const decimals = absValue >= 100 ? 0 : absValue >= 10 ? 1 : 2;
        const rendered = numeric.toFixed(decimals);
        const normalizedUnit = String(unit || '').toLowerCase();
        return normalizedUnit.includes('percent') || normalizedUnit.includes('%') ? `${rendered}%` : rendered;
    }

    function spark(series) {
        if (!Array.isArray(series) || series.length < 2) return '';
        const last = series.slice(-10);
        const values = last.map((d) => Number(d.value)).filter((v) => Number.isFinite(v));
        if (values.length < 2) return '';
        const min = Math.min(...values);
        const max = Math.max(...values);
        const w = 90;
        const h = 22;
        const p = 2;
        const x = (index) => p + (index * (w - (2 * p)) / (last.length - 1));
        const y = (value) => (max === min ? h / 2 : p + ((h - (2 * p)) * (1 - ((value - min) / (max - min)))));
        const points = last.map((point, idx) => `${x(idx)},${y(Number(point.value))}`).join(' ');
        return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline fill="none" points="${points}" /></svg>`;
    }

    function renderIMFCard(data) {
        if (!data || !Array.isArray(data.metrics) || !data.metrics.length) return '';
        const tiles = data.metrics.map((metric) => {
            const year = metric && metric.latest && metric.latest.year ? metric.latest.year : '';
            const value = fmt(metric && metric.latest ? metric.latest.value : null, metric && metric.unit ? metric.unit : '');
            const deltaValue = metric ? metric.delta : null;
            const delta = deltaValue === null || deltaValue === undefined || Number.isNaN(Number(deltaValue))
                ? '—'
                : (Number(deltaValue) >= 0 ? `+${fmt(deltaValue, metric.unit || '')}` : fmt(deltaValue, metric.unit || ''));
            return `
                <div class="metric-tile">
                    <div class="metric-top">
                        <div class="metric-label">${esc(metric.label || metric.code || 'Indicator')}</div>
                        <div class="metric-year">${esc(year)}</div>
                    </div>
                    <div class="metric-value">${esc(value)}</div>
                    <div class="metric-bottom">
                        <div class="metric-delta">YoY: ${esc(delta)}</div>
                        ${spark(metric.series || [])}
                    </div>
                </div>
            `;
        }).join('');

        const asOf = typeof data.asOf === 'string' && data.asOf.length >= 10 ? data.asOf.slice(0, 10) : '—';
        return `
            <section class="panel imf-card">
                <div class="card-head">
                    <div>
                        <h3>IMF Macro Snapshot</h3>
                        <div class="meta">Updated: ${esc(asOf)}</div>
                    </div>
                    <a class="small-link" href="https://www.imf.org/external/datamapper/profile/VEN" target="_blank" rel="noopener">Open IMF Profile</a>
                </div>
                <div class="metric-grid">${tiles}</div>
            </section>
        `;
    }

    function renderItem(item) {
        const preview = normalizePreview(item.preview || '');
        if (preview.length < 80) return '';
        const sourceDate = (item.sourcePublishedAt || '').trim();
        const isVerified = sourceDate.length > 0;

        return `
            <article class="item-card">
                <div class="item-head">
                    <h5><a id="item-${esc(item.id)}"></a><a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.title)}</a></h5>
                </div>
                ${isVerified ? '<p class="item-verified">Verified article URL</p>' : ''}
                ${sourceDate ? `<p class="item-source-date">Source date: ${esc(sourceDate)}</p>` : ''}
                <p class="item-desc">${esc(preview)}</p>
            </article>
        `;
    }

    function renderSectors(latest, activeLanguage, rejectedRuntime) {
        return (latest.sectors || []).map((sector) => {
            const renderedItems = (sector.items || [])
                .filter((item) => {
                    if (detectLanguage(item) !== activeLanguage) {
                        rejectedRuntime.push({ reason: 'wrong_language', title: item.title || '', finalUrl: item.url || '' });
                        return false;
                    }
                    if (!isArticleUrl(item.url || '')) {
                        rejectedRuntime.push({ reason: 'url_not_article_runtime', title: item.title || '', finalUrl: item.url || '' });
                        return false;
                    }
                    return true;
                })
                .map(renderItem)
                .filter(Boolean)
                .join('');
            if (!renderedItems) return '';
            return `
                <section class="sector-block">
                    <h3>${esc(sector.name)}</h3>
                    <div class="items-grid">${renderedItems}</div>
                </section>
            `;
        }).filter(Boolean).join('');
    }

    function renderRejectedDebug(rejectedRuntime, rejectedBuild) {
        const merged = [...(rejectedRuntime || []), ...(rejectedBuild || [])];
        if (!merged.length) return '';
        const rows = merged.slice(0, 300).map((item) => `
            <li><strong>${esc(item.reason || 'rejected')}</strong> — ${esc(item.title || '')}${item.finalUrl ? ` · <a href="${esc(item.finalUrl)}" target="_blank" rel="noopener">link</a>` : ''}</li>
        `).join('');
        return `
            <section class="panel">
                <details>
                    <summary>Rejected items (debug)</summary>
                    <ul>${rows}</ul>
                </details>
            </section>
        `;
    }

    function renderMacros(macros) {
        const indicators = Array.isArray(macros && macros.indicators) ? macros.indicators : [];
        const hasMeaningfulData = indicators.some((metric) => {
            const value = String((metric && metric.value) || '').trim().toLowerCase();
            const trend = String((metric && metric.trend) || '').trim().toLowerCase();
            if (!value) return false;
            if (value === 'n/a' || value === 'na' || value === '—' || value === '-') return false;
            if (trend.includes('pending')) return false;
            return true;
        });

        if (!hasMeaningfulData) return '';

        return `
            <section class="macro-block">
                <h3>Macro Indicators</h3>
                <p class="macro-note">Daily refresh at end-of-report for context and trend checks.</p>
                <div class="macro-grid">
                    ${indicators.map((m) => `
                        <article class="macro-card">
                            <h4>${esc(m.name)}</h4>
                            <p class="macro-value">${esc(m.value)}</p>
                            <p class="macro-trend">${esc(m.trend)}</p>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;
    }

    function computeBdSignals(items) {
        const kw = [
            'esg', 'corporate sustainability', 'shared value', 'scope 3', 'responsible sourcing',
            'supply chain', 'procurement', 'tender', 'rfp', 'rfi', 'call for proposals',
            'innovation challenge', 'grant facility', 'foundation', 'csr', 'impact investment',
            'blended finance', 'public-private', 'ppp', 'co-investment', 'biodiversity',
            'nature positive', 'just transition', 'energy transition', 'community engagement',
            'stakeholder engagement', 'local sourcing', 'supplier development'
        ];

        const corp = [
            'exxonmobil', 'chevron', 'walmart', 'unilever', 'nestlé', 'nestle', 'cargill',
            'microsoft', 'amazon'
        ];

        const now = Date.now();
        const days7 = 7 * 24 * 60 * 60 * 1000;

        const recent = (items || []).filter((it) => {
            const d = Date.parse(it.publishedAt || it.dateISO || '');
            return Number.isFinite(d) ? (now - d) <= days7 : false;
        });

        const hits = [];
        for (const it of recent) {
            const hay = [
                it.title, it.preview, it.description, it.snippet,
                ...(it.tags || []), ...(it.categories || [])
            ].filter(Boolean).join(' ').toLowerCase();

            const kwHit = kw.find((k) => hay.includes(k));
            const corpHit = corp.find((c) => hay.includes(c));

            if (kwHit || corpHit) {
                hits.push({
                    id: it.id,
                    title: it.title,
                    url: it.url,
                    publishedAt: it.publishedAt || it.dateISO || '',
                    match: corpHit ? `Company mention: ${corpHit}` : `Keyword: ${kwHit}`
                });
            }
        }

        hits.sort((a, b) => {
            const aCorp = a.match.startsWith('Company') ? 1 : 0;
            const bCorp = b.match.startsWith('Company') ? 1 : 0;
            if (aCorp !== bCorp) return bCorp - aCorp;
            return (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0);
        });

        return hits.slice(0, 6);
    }

    function renderBdOpportunitiesCard(items) {
        const signals = computeBdSignals(items);

        const signalsHtml = signals.length
            ? `
                <div class="bd-subhead">Live signals (last 7 days)</div>
                <ul class="bd-signals">
                    ${signals.map((s) => `
                        <li>
                            <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>
                            <div class="bd-signal-meta">${esc(s.match)} · ${esc(String(s.publishedAt).slice(0, 10))}</div>
                        </li>
                    `).join('')}
                </ul>
            `
            : '<div class="bd-muted">No clear corporate ESG BD signals detected in the last 7 days from your current feed set.</div>';

        return `
            <section class="panel bd-card" id="bd-opportunities">
                <div class="bd-head">
                    <div>
                        <h3>BD Opportunities in Venezuela</h3>
                        <div class="bd-meta">Corporate sustainability, ESG, shared value, and partnership work focused on Venezuela only.</div>
                    </div>
                </div>

                ${signalsHtml}

                <hr class="bd-divider" />

                <div class="bd-grid">
                    <div class="bd-col">
                        <h4>Expansion: Corporate Sustainability & ESG Partnerships</h4>
                        <p class="bd-body">
                            MarketEdge can support multinational corporations pursuing sustainability, ESG, and shared value strategies in Venezuela.
                            Focus on practical deal pathways: risk-aware partnership design, investable ESG roadmaps, and implementation support.
                        </p>

                        <div class="bd-subhead">Target corporate partners to watch</div>
                        <ul class="bd-list">
                            <li>ExxonMobil, Chevron</li>
                            <li>Walmart, Unilever, Nestlé, Cargill</li>
                            <li>Microsoft, Amazon</li>
                            <li>Mining, energy, agribusiness, and infrastructure firms with Venezuela exposure</li>
                        </ul>

                        <div class="bd-subhead">Ideal engagement types</div>
                        <ul class="bd-list">
                            <li>ESG market diagnostics and entry or re-entry planning for Venezuela</li>
                            <li>Shared value partnership design with local actors and donors</li>
                            <li>Multi-stakeholder convenings and facilitation</li>
                            <li>Political economy and stakeholder risk analysis</li>
                            <li>Sustainability-aligned investment roadmaps and KPI frameworks</li>
                            <li>Bridge-building across corporate, donor, and local ecosystems</li>
                        </ul>
                    </div>

                    <div class="bd-col">
                        <h4>Corporate-focused service areas</h4>

                        <div class="bd-subhead">1. ESG Strategy & Market-Based Sustainability</div>
                        <ul class="bd-list">
                            <li>ESG-aligned investment strategy</li>
                            <li>Climate resilience and biodiversity integration</li>
                            <li>Community engagement and stakeholder alignment</li>
                            <li>Shared value partnership models and blended finance structuring</li>
                            <li>Supply chain resilience and local sourcing strategies</li>
                        </ul>

                        <div class="bd-subhead">2. Sustainable Supply Chain & Market Systems</div>
                        <ul class="bd-list">
                            <li>Value chain diagnostics and responsible sourcing strategy</li>
                            <li>Inclusive supplier development and local enterprise integration</li>
                            <li>Climate-smart agriculture partnerships</li>
                            <li>Extractives community development strategy</li>
                        </ul>

                        <div class="bd-subhead">3. Public-Private Partnership Structuring</div>
                        <ul class="bd-list">
                            <li>PPP design between corporations and governments</li>
                            <li>Co-investment platform design and governance</li>
                            <li>Outcome-based contracting models</li>
                            <li>Multi-stakeholder coordination mechanisms</li>
                        </ul>

                        <div class="bd-subhead">4. AI-Enabled ESG Intelligence</div>
                        <ul class="bd-list">
                            <li>Rapid landscape analysis for market entry or expansion</li>
                            <li>Political economy risk scanning and stakeholder mapping</li>
                            <li>Partnership diagnostics and execution tracking</li>
                            <li>Sustainability performance dashboards</li>
                        </ul>

                        <div class="bd-subhead">Keywords to monitor</div>
                        <p class="bd-body">
                            ESG strategy; corporate sustainability; shared value partnership; climate resilience investment; sustainable supply chain;
                            responsible sourcing; community development program; public private partnership; blended finance platform; nature positive investment;
                            just transition; energy transition partnership; extractives community engagement; sustainable agriculture sourcing; corporate co-investment.
                        </p>
                    </div>
                </div>

                <div class="bd-foot">
                    <div class="bd-positioning">
                        <strong>Positioning statement:</strong> MarketEdge helps corporations translate sustainability ambition into investable, partnership-driven strategies in Venezuela.
                        We combine AI-enabled intelligence, stakeholder engagement, and structured partnership design to reduce risk, align incentives, and deliver measurable ESG outcomes.
                    </div>
                </div>
            </section>
        `;
    }

    async function init() {
        const root = document.getElementById('app-root');
        if (!root) return;
        try {
            const [latest, macros, imf] = await Promise.all([
                loadJson('data/latest.json'),
                loadJson('data/macros.json'),
                loadIMF()
            ]);
            const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';
            let rejectedBuild = [];
            if (debugMode) {
                try {
                    rejectedBuild = await loadJson('data/rejected_links.json');
                } catch {
                    rejectedBuild = [];
                }
            }

            let activeLanguage = 'en';
            const languageCounts = (latest.sectors || []).flatMap((sector) => (sector.items || []))
                .reduce((acc, item) => {
                    const lang = detectLanguage(item);
                    if (lang === 'en' || lang === 'es') acc[lang] += 1;
                    return acc;
                }, { en: 0, es: 0 });
            if (languageCounts.es > languageCounts.en) activeLanguage = 'es';
            if (languageCounts.en === 0 && languageCounts.es > 0) activeLanguage = 'es';

            const render = () => {
                const rejectedRuntime = [];
                const sectorsHtml = renderSectors(latest, activeLanguage, rejectedRuntime);
                const allItemsSorted = (latest.sectors || [])
                    .flatMap((sector) => (sector.items || []))
                    .sort((a, b) => (Date.parse(b.publishedAt || b.dateISO || '') || 0) - (Date.parse(a.publishedAt || a.dateISO || '') || 0));
                root.innerHTML = `
                    ${renderLanguageSwitcher(activeLanguage)}
                    ${renderIMFCard(imf)}
                    ${sectorsHtml || '<section class="panel"><p>No article previews available for the selected language.</p></section>'}
                    ${renderMacros(macros)}
                    ${renderBdOpportunitiesCard(allItemsSorted || [])}
                    ${debugMode ? renderRejectedDebug(rejectedRuntime, rejectedBuild) : ''}
                `;
            };

            root.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                if (!target.classList.contains('lang-btn')) return;
                const selected = target.getAttribute('data-lang');
                if (!selected || (selected !== 'en' && selected !== 'es') || selected === activeLanguage) return;
                activeLanguage = selected;
                render();
            });

            render();
        } catch (error) {
            root.innerHTML = `<p class="error">Unable to load dashboard data: ${esc(error.message)}</p>`;
        }
    }

    init();
})();
