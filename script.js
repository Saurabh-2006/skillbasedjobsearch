/* =========================================================
   AI JobFinder – script.js
   Home page logic: mock data, filtering, scoring, rendering
   ========================================================= */

'use strict';

/* ── Mock Job Data ─────────────────────────────────────── */
const JOB_DATA = [
  {
    id: 1,
    title: "Senior Python Developer",
    company: "NeuroSoft Labs",
    location: "Remote (Worldwide)",
    tags: ["python", "django", "rest api", "postgresql", "docker", "remote", "backend", "senior"],
    type: "Full-time",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "DeepVision AI",
    location: "San Francisco, CA",
    tags: ["python", "machine learning", "ml", "tensorflow", "pytorch", "data science", "ai", "deep learning"],
    type: "Full-time",
  },
  {
    id: 3,
    title: "Frontend React Engineer",
    company: "Kova Tech",
    location: "New York, NY",
    tags: ["react", "javascript", "typescript", "frontend", "css", "node", "ui", "web", "new york", "nyc"],
    type: "Full-time",
  },
  {
    id: 4,
    title: "Data Scientist – NLP",
    company: "LexiQ Analytics",
    location: "Remote (US Only)",
    tags: ["python", "nlp", "data science", "machine learning", "ml", "spacy", "bert", "remote", "data"],
    type: "Full-time",
  },
  {
    id: 5,
    title: "UX Designer",
    company: "Mosaic Studio",
    location: "New York, NY",
    tags: ["ux", "ui", "design", "figma", "user research", "wireframing", "prototype", "new york", "nyc", "designer"],
    type: "Full-time",
  },
  {
    id: 6,
    title: "DevOps Engineer – AWS",
    company: "CloudAxis",
    location: "Remote (Worldwide)",
    tags: ["devops", "aws", "cloud", "kubernetes", "docker", "terraform", "ci/cd", "linux", "remote", "infrastructure"],
    type: "Full-time",
  },
  {
    id: 7,
    title: "iOS Developer (Swift)",
    company: "Finity Apps",
    location: "Austin, TX",
    tags: ["ios", "swift", "mobile", "xcode", "apple", "objective-c", "app development", "austin"],
    type: "Full-time",
  },
  {
    id: 8,
    title: "Product Designer",
    company: "Iterata",
    location: "Remote (EU)",
    tags: ["product design", "design", "figma", "ux", "ui", "saas", "b2b", "remote", "designer", "startup"],
    type: "Full-time",
  },
  {
    id: 9,
    title: "Backend Node.js Engineer",
    company: "Axio Finance",
    location: "London, UK",
    tags: ["node", "nodejs", "javascript", "typescript", "backend", "api", "fintech", "postgresql", "london"],
    type: "Full-time",
  },
  {
    id: 10,
    title: "Data Engineer – Spark",
    company: "Pulsar Data",
    location: "Remote (Worldwide)",
    tags: ["data engineering", "spark", "python", "hadoop", "sql", "etl", "data", "aws", "remote", "big data"],
    type: "Full-time",
  },
  {
    id: 11,
    title: "Fullstack Developer (Vue + Python)",
    company: "Zendric",
    location: "Berlin, Germany",
    tags: ["fullstack", "vue", "python", "fastapi", "postgres", "docker", "javascript", "startup", "berlin"],
    type: "Full-time",
  },
  {
    id: 12,
    title: "AI Research Scientist",
    company: "Luminary AI",
    location: "Remote (Worldwide)",
    tags: ["ai", "research", "machine learning", "ml", "deep learning", "python", "pytorch", "llm", "remote", "senior"],
    type: "Full-time",
  },
  {
    id: 13,
    title: "Android Developer (Kotlin)",
    company: "Motrix Labs",
    location: "Bangalore, India",
    tags: ["android", "kotlin", "mobile", "java", "app development", "jetpack compose", "bangalore", "india"],
    type: "Full-time",
  },
  {
    id: 14,
    title: "Cloud Architect",
    company: "SkyBridge Systems",
    location: "Seattle, WA",
    tags: ["cloud", "aws", "azure", "gcp", "architecture", "devops", "infrastructure", "senior", "seattle"],
    type: "Full-time",
  },
  {
    id: 15,
    title: "Cybersecurity Analyst",
    company: "IronShield",
    location: "Remote (US Only)",
    tags: ["cybersecurity", "security", "soc", "siem", "incident response", "penetration testing", "remote", "analyst"],
    type: "Full-time",
  },
  {
    id: 16,
    title: "React Native Developer",
    company: "Nimbus Apps",
    location: "Remote (Worldwide)",
    tags: ["react native", "react", "mobile", "javascript", "typescript", "ios", "android", "remote", "cross-platform"],
    type: "Full-time",
  },
  {
    id: 17,
    title: "Python Backend Engineer – Fintech",
    company: "ClearLedger",
    location: "Singapore",
    tags: ["python", "backend", "fintech", "fastapi", "microservices", "docker", "kubernetes", "singapore", "finance"],
    type: "Full-time",
  },
  {
    id: 18,
    title: "Site Reliability Engineer",
    company: "Vertex Cloud",
    location: "Remote (Worldwide)",
    tags: ["sre", "reliability", "devops", "kubernetes", "prometheus", "grafana", "linux", "python", "remote"],
    type: "Full-time",
  },
];

/* ── Scoring Logic ─────────────────────────────────────── */

/**
 * Calculates a match score (0–100) by checking how many query
 * keywords appear in the job's tags, title, company, and location.
 */
function calculateMatchScore(job, keywords) {
  if (!keywords.length) return Math.floor(Math.random() * 30) + 60;

  const haystack = [
    job.title.toLowerCase(),
    job.company.toLowerCase(),
    job.location.toLowerCase(),
    ...job.tags,
  ].join(' ');

  let hits = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) hits++;
  }

  // Base score from keyword density
  const density = hits / keywords.length;
  // Scale between 42–99 and add slight jitter
  const base = Math.round(42 + density * 54);
  const jitter = Math.floor(Math.random() * 6) - 3;
  return Math.min(99, Math.max(10, base + jitter));
}

/**
 * Parse the textarea input into lowercase keywords, stripping
 * common stop words so scoring isn't diluted.
 */
const STOP_WORDS = new Set([
  'i', 'a', 'an', 'the', 'and', 'or', 'for', 'in', 'at', 'to',
  'of', 'is', 'my', 'with', 'on', 'be', 'have', 'are', 'want',
  'looking', 'need', 'role', 'job', 'position', 'work', 'working',
  'experience', 'years', 'year', 'good', 'great', 'some', 'any',
]);

function parseKeywords(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/* ── Filtering ─────────────────────────────────────────── */

function filterAndScore(query) {
  const keywords = parseKeywords(query);

  const results = JOB_DATA.map(job => {
    const score = calculateMatchScore(job, keywords);

    // If user typed a query, only include if at least one keyword matches
    if (keywords.length > 0) {
      const haystack = [
        job.title.toLowerCase(),
        job.company.toLowerCase(),
        job.location.toLowerCase(),
        ...job.tags,
      ].join(' ');
      const anyMatch = keywords.some(kw => haystack.includes(kw));
      if (!anyMatch) return null;
    }

    return { ...job, score };
  }).filter(Boolean);

  return results;
}

/* ── Sorting ───────────────────────────────────────────── */

function sortResults(results, by) {
  return [...results].sort((a, b) => {
    if (by === 'score')   return b.score - a.score;
    if (by === 'title')   return a.title.localeCompare(b.title);
    if (by === 'company') return a.company.localeCompare(b.company);
    return 0;
  });
}

/* ── Rendering ─────────────────────────────────────────── */

function scoreClass(score) {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
}

function scoreFillColor(score) {
  if (score >= 80) return 'var(--green)';
  if (score >= 60) return 'var(--cyan)';
  return 'var(--amber)';
}

function renderTable(results) {
  const tbody = document.getElementById('jobsTableBody');
  tbody.innerHTML = '';

  results.forEach((job, idx) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${idx * 40}ms`;

    const cls   = scoreClass(job.score);
    const color = scoreFillColor(job.score);
    const locIcon = job.location.toLowerCase().includes('remote') ? '🌐' : '📍';

    tr.innerHTML = `
      <td class="td-title">${escHtml(job.title)}</td>
      <td class="td-company">${escHtml(job.company)}</td>
      <td class="td-location">
        <span class="td-location-icon">${locIcon}</span>${escHtml(job.location)}
      </td>
      <td>
        <span class="score-badge ${cls}">
          ${job.score}%
          <span class="score-bar">
            <span class="score-fill" style="width:${job.score}%;background:${color}"></span>
          </span>
        </span>
      </td>
      <td>
        <button class="btn-apply" aria-label="Apply for ${escHtml(job.title)}">
          Apply →
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── State ─────────────────────────────────────────────── */
let currentResults = [];
let currentQuery   = '';

/* ── UI Show/Hide helpers ──────────────────────────────── */

function showSpinner() {
  document.getElementById('spinnerWrap').classList.add('visible');
  document.getElementById('emptyState').style.display    = 'none';
  document.getElementById('noResults').style.display     = 'none';
  document.getElementById('resultsContent').style.display = 'none';
}

function hideSpinner() {
  document.getElementById('spinnerWrap').classList.remove('visible');
}

function showResults(results, query) {
  hideSpinner();

  if (results.length === 0) {
    document.getElementById('noResults').style.display = 'flex';
    return;
  }

  const sortBy = document.getElementById('sortSelect').value;
  const sorted = sortResults(results, sortBy);

  document.getElementById('resultCount').textContent  = results.length;
  document.getElementById('resultsQuery').textContent = query ? `for "${query}"` : '';
  document.getElementById('resultsContent').style.display = 'block';

  renderTable(sorted);
}

/* ── Scan counter animation ────────────────────────────── */

function animateScanCount(total, duration) {
  const el = document.getElementById('scanCount');
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(t * total).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Main search handler ───────────────────────────────── */

function handleSearch() {
  const query    = document.getElementById('queryInput').value.trim();
  const btnLabel = document.getElementById('btnLabel');

  btnLabel.textContent = 'Searching…';
  document.getElementById('searchBtn').disabled = true;

  showSpinner();
  animateScanCount(JOB_DATA.length * 600 + Math.floor(Math.random() * 80000), 900);

  // Simulate 1s AI processing delay
  setTimeout(() => {
    currentQuery   = query;
    currentResults = filterAndScore(query);

    showResults(currentResults, query);

    btnLabel.textContent = 'Search Jobs';
    document.getElementById('searchBtn').disabled = false;
  }, 1100);
}

/* ── Sort change ───────────────────────────────────────── */

document.getElementById('sortSelect').addEventListener('change', () => {
  if (!currentResults.length) return;
  const sortBy = document.getElementById('sortSelect').value;
  renderTable(sortResults(currentResults, sortBy));
});

/* ── Search button ─────────────────────────────────────── */

document.getElementById('searchBtn').addEventListener('click', handleSearch);

/* ── Enter key in textarea ─────────────────────────────── */

document.getElementById('queryInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    handleSearch();
  }
});

/* ── Quick chips ───────────────────────────────────────── */

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('queryInput').value = chip.dataset.query;
    handleSearch();
  });
});

/* ── Apply button click (demo) ─────────────────────────── */

document.getElementById('jobsTableBody').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-apply');
  if (!btn) return;
  const row   = btn.closest('tr');
  const title = row.querySelector('.td-title').textContent;
  btn.textContent = '✓ Applied!';
  btn.style.background    = 'var(--green-dim)';
  btn.style.borderColor   = 'var(--green)';
  btn.style.color         = 'var(--green)';
  btn.disabled = true;
  // Reset after 3 s
  setTimeout(() => {
    btn.textContent     = 'Apply →';
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.color       = '';
    btn.disabled = false;
  }, 3000);
});
