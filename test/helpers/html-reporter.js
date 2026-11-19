import WDIOReporter from '@wdio/reporter';
import fs from 'node:fs';
import path from 'node:path';

export default class CustomHtmlReporter extends WDIOReporter {
  constructor(options) {
    const outputDir = options?.outputDir || process.env.REPORT_DIR || './reports';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const logFile = path.join(outputDir, 'reporter.log');
    super(Object.assign({ stdout: false, logFile }, options));

    this.options = options || {};
    this.outputDir = path.resolve(outputDir);
    this.moduleName = options?.moduleName || process.env.MODULE_NAME || '';
    this.tests = [];
    this.startTime = Date.now();
  }

  onTestPass(test) {
    this.tests.push({
      suite: test.parent || 'General',
      title: test.title,
      state: 'passed',
      duration: test._duration || test.duration || 0,
      error: null,
    });
  }

  onTestFail(test) {
    const errorMsg = test.error ? (test.error.message || String(test.error)) : 'Unknown error';
    const stack = test.error ? (test.error.stack || '') : '';
    this.tests.push({
      suite: test.parent || 'General',
      title: test.title,
      state: 'failed',
      duration: test._duration || test.duration || 0,
      error: { message: errorMsg, stack },
    });
  }

  onTestSkip(test) {
    this.tests.push({
      suite: test.parent || 'General',
      title: test.title,
      state: 'skipped',
      duration: 0,
      error: null,
    });
  }

  onRunnerEnd(runner) {
    const totalDuration = Date.now() - this.startTime;
    const total = this.tests.length;
    const passed = this.tests.filter((t) => t.state === 'passed').length;
    const failed = this.tests.filter((t) => t.state === 'failed').length;
    const skipped = this.tests.filter((t) => t.state === 'skipped').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const timestamp = new Date().toLocaleString();

    // Group tests by suite
    const suitesMap = new Map();
    for (const t of this.tests) {
      if (!suitesMap.has(t.suite)) {
        suitesMap.set(t.suite, []);
      }
      suitesMap.get(t.suite).push(t);
    }

    const reportData = {
      moduleName: this.moduleName || '',
      summary: {
        total,
        passed,
        failed,
        skipped,
        passRate,
        totalDuration,
        timestamp,
      },
      suites: Array.from(suitesMap.entries()).map(([suite, tests]) => ({
        name: suite,
        tests,
      })),
    };

    // 1. Write JSON report
    const jsonPath = path.join(this.outputDir, 'report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf-8');

    // 2. Write Markdown report
    const mdContent = this._generateMarkdown(reportData);
    const mdPath = path.join(this.outputDir, 'report.md');
    fs.writeFileSync(mdPath, mdContent, 'utf-8');

    // 3. Write HTML report
    const htmlContent = this._generateHtml(reportData);
    const htmlPath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

    console.log(`\n\x1b[32m✔\x1b[0m Test Report generated: file://${htmlPath}\n`);
  }

  _generateMarkdown(data) {
    const s = data.summary;
    const title = data.moduleName ? `Zippiee Driver – ${data.moduleName} Report` : 'Zippiee Driver – Test Execution Report';
    let md = `# ${title}\n\n`;
    md += `> **Execution Timestamp:** ${s.timestamp}  \n`;
    md += `> **Total Duration:** ${(s.totalDuration / 1000).toFixed(1)}s  \n`;
    md += `> **Summary:** ${s.passed} Passed, ${s.failed} Failed, ${s.skipped} Skipped (${s.passRate}% Pass Rate)\n\n`;
    md += `| Metric | Count |\n|---|---|\n`;
    md += `| Total Tests | ${s.total} |\n`;
    md += `| Passed | ${s.passed} |\n`;
    md += `| Failed | ${s.failed} |\n`;
    md += `| Skipped | ${s.skipped} |\n`;
    md += `| Pass Rate | ${s.passRate}% |\n\n`;

    md += `## Detailed Test Results\n\n`;
    for (const suite of data.suites) {
      md += `### ${suite.name}\n\n`;
      md += `| Status | Test Title | Duration |\n|---|---|---|\n`;
      for (const t of suite.tests) {
        const icon = t.state === 'passed' ? '✔ Passed' : t.state === 'failed' ? '✖ Failed' : '○ Skipped';
        md += `| ${icon} | ${t.title} | ${(t.duration / 1000).toFixed(2)}s |\n`;
      }
      md += `\n`;
    }
    return md;
  }

  _generateHtml(data) {
    const s = data.summary;
    const pageTitle = data.moduleName ? `${data.moduleName} – Zippiee Driver Report` : 'Zippiee Driver – Automation Test Report';
    const headerTitle = data.moduleName ? `${data.moduleName} Execution Report` : 'Zippiee Driver – Automation Execution Report';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
      --pass: #10b981;
      --fail: #ef4444;
      --skip: #f59e0b;
      --accent: #3b82f6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 32px 24px;
      line-height: 1.5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      margin-bottom: 28px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
    }
    h1 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 6px; }
    .subtitle { color: var(--text-muted); font-size: 14px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
    }
    .stat-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #fff; }
    .stat-card.passed .stat-value { color: var(--pass); }
    .stat-card.failed .stat-value { color: var(--fail); }
    .stat-card.skipped .stat-value { color: var(--skip); }
    .stat-card.rate .stat-value { color: var(--accent); }

    .progress-bar-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .progress-bar {
      height: 12px;
      border-radius: 6px;
      background: #334155;
      display: flex;
      overflow: hidden;
      margin-top: 8px;
    }
    .bar-passed { background: var(--pass); height: 100%; }
    .bar-failed { background: var(--fail); height: 100%; }
    .bar-skipped { background: var(--skip); height: 100%; }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      color: #fff;
      border-color: var(--accent);
      background: rgba(59, 130, 246, 0.15);
    }
    .search-input {
      flex: 1;
      min-width: 250px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 14px;
      color: #fff;
      font-size: 13px;
    }
    .search-input:focus { outline: none; border-color: var(--accent); }

    .suite-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .suite-header {
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border);
      font-size: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-list { list-style: none; }
    .test-item {
      padding: 12px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .test-item:last-child { border-bottom: none; }
    .test-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .test-info { display: flex; align-items: center; gap: 12px; }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge.passed { background: rgba(16, 185, 129, 0.15); color: var(--pass); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge.failed { background: rgba(239, 68, 68, 0.15); color: var(--fail); border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge.skipped { background: rgba(245, 158, 11, 0.15); color: var(--skip); border: 1px solid rgba(245, 158, 11, 0.3); }
    .test-title { font-size: 14px; color: #fff; font-weight: 500; }
    .test-duration { font-size: 12px; color: var(--text-muted); font-family: monospace; }
    .error-box {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 6px;
      font-family: monospace;
      font-size: 12px;
      color: #fca5a5;
      white-space: pre-wrap;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    ${data.moduleName ? `<div style="margin-bottom: 16px;"><a href="../index.html" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">← Back to Modules Overview Dashboard</a></div>` : ''}
    <header>
      <h1>${headerTitle}</h1>
      <div class="subtitle">Generated: ${s.timestamp} &bull; Platform: Android &bull; Framework: WebdriverIO + Appium Flutter Driver</div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Total Tests</span>
        <span class="stat-value">${s.total}</span>
      </div>
      <div class="stat-card passed">
        <span class="stat-label">Passed</span>
        <span class="stat-value">${s.passed}</span>
      </div>
      <div class="stat-card failed">
        <span class="stat-label">Failed</span>
        <span class="stat-value">${s.failed}</span>
      </div>
      <div class="stat-card skipped">
        <span class="stat-label">Skipped</span>
        <span class="stat-value">${s.skipped}</span>
      </div>
      <div class="stat-card rate">
        <span class="stat-label">Pass Rate</span>
        <span class="stat-value">${s.passRate}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Duration</span>
        <span class="stat-value">${(s.totalDuration / 1000).toFixed(1)}s</span>
      </div>
    </div>

    <div class="progress-bar-container">
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted);">
        <span>Execution Progress</span>
        <span>${s.passed} of ${s.total} tests passed (${s.passRate}%)</span>
      </div>
      <div class="progress-bar">
        <div class="bar-passed" style="width: ${s.total > 0 ? (s.passed / s.total) * 100 : 0}%;"></div>
        <div class="bar-failed" style="width: ${s.total > 0 ? (s.failed / s.total) * 100 : 0}%;"></div>
        <div class="bar-skipped" style="width: ${s.total > 0 ? (s.skipped / s.total) * 100 : 0}%;"></div>
      </div>
    </div>

    <div class="controls">
      <button class="filter-btn active" onclick="filterTests('all', this)">All (${s.total})</button>
      <button class="filter-btn" onclick="filterTests('passed', this)">Passed (${s.passed})</button>
      <button class="filter-btn" onclick="filterTests('failed', this)">Failed (${s.failed})</button>
      <button class="filter-btn" onclick="filterTests('skipped', this)">Skipped (${s.skipped})</button>
      <input type="text" class="search-input" id="search" placeholder="Search test cases or suites..." onkeyup="searchTests()">
    </div>

    <div id="suites-container">
      ${data.suites.map((suite) => `
        <div class="suite-card" data-suite="${suite.name.toLowerCase()}">
          <div class="suite-header">
            <span>${suite.name}</span>
            <span style="font-size: 13px; color: var(--text-muted); font-weight: normal;">
              ${suite.tests.filter((t) => t.state === 'passed').length} / ${suite.tests.length} passed
            </span>
          </div>
          <ul class="test-list">
            ${suite.tests.map((t) => `
              <li class="test-item" data-state="${t.state}" data-title="${t.title.toLowerCase()}">
                <div class="test-row">
                  <div class="test-info">
                    <span class="badge ${t.state}">${t.state}</span>
                    <span class="test-title">${t.title}</span>
                  </div>
                  <span class="test-duration">${(t.duration / 1000).toFixed(2)}s</span>
                </div>
                ${t.error ? `<div class="error-box">${t.error.message}\n\n${t.error.stack}</div>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    let currentFilter = 'all';

    function filterTests(state, btn) {
      currentFilter = state;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    }

    function searchTests() {
      applyFilters();
    }

    function applyFilters() {
      const query = document.getElementById('search').value.toLowerCase().trim();
      const suiteCards = document.querySelectorAll('.suite-card');

      suiteCards.forEach(card => {
        let visibleInSuite = 0;
        const items = card.querySelectorAll('.test-item');
        items.forEach(item => {
          const itemState = item.getAttribute('data-state');
          const itemTitle = item.getAttribute('data-title');
          const matchesState = currentFilter === 'all' || itemState === currentFilter;
          const matchesQuery = !query || itemTitle.includes(query) || card.getAttribute('data-suite').includes(query);

          if (matchesState && matchesQuery) {
            item.style.display = 'flex';
            visibleInSuite++;
          } else {
            item.style.display = 'none';
          }
        });

        card.style.display = visibleInSuite > 0 ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
  }
}
