import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const MODULES = [
  {
    id: '01-auth',
    suite: 'auth',
    name: '01. Auth Module (Sign In & OTP)',
    description: 'Fresh install, phone validation, country picker, OTP countdown & login',
    trackerCodes: 'AS-01..AS-06, AU-01..AU-16',
    outputDir: './reports/01-auth',
  },
  {
    id: '02-home',
    suite: 'home',
    name: '02. Home & Notifications Module',
    description: 'Dashboard top bar, progress tiles, 4 bottom tabs, Notifications tabs',
    trackerCodes: 'PR-01..PR-03, HM-01..HM-15, NT-01..NT-05',
    outputDir: './reports/02-home',
  },
  {
    id: '03-wallet',
    suite: 'wallet',
    name: '03. Wallet Module',
    description: 'Balance carousel, withdrawable card, eye toggle, deposit, withdraw, transaction history',
    trackerCodes: 'WL-01..WL-25',
    outputDir: './reports/03-wallet',
  },
  {
    id: '04-orders',
    suite: 'orders',
    name: '04. Orders Module',
    description: 'Orders history list, status tabs (All/Completed/Cancelled/Rejected), filter sheet',
    trackerCodes: 'OH-01..OH-11',
    outputDir: './reports/04-orders',
  },
  {
    id: '05-profile',
    suite: 'profile',
    name: '05. Profile Module',
    description: 'Profile settings, performance rates, vehicle details, refer & earn, help, logout modal',
    trackerCodes: 'PF-01..PF-17, VD-01..VD-09, RF-01..RF-05',
    outputDir: './reports/05-profile',
  },
  {
    id: '06-signup',
    suite: 'signup',
    name: '06. Sign-Up & Registration (Standalone)',
    description: 'New driver registration form, NIN tooltip, blocked/suspended account screens',
    trackerCodes: 'AU-18..AU-27',
    outputDir: './reports/06-signup',
  },
  {
    id: '07-activeOrder',
    suite: 'activeOrder',
    name: '07. Active Order & Delivery Flow (Standalone)',
    description: 'Incoming order request, tracking card, in-app chat, merchant pickup, customer delivery OTP, completion',
    trackerCodes: 'OF-01..OF-17, OD-01..OD-26, CT-01..CT-08',
    outputDir: './reports/07-activeOrder',
  },
];

export function generateMasterDashboard(reportsDir = './reports') {
  const resolvedDir = path.resolve(reportsDir);
  const moduleResults = [];

  for (const m of MODULES) {
    const jsonPath = path.resolve(m.outputDir, 'report.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        moduleResults.push({
          ...m,
          hasRun: true,
          summary: data.summary,
        });
      } catch (err) {
        console.error(`Could not parse ${jsonPath}:`, err.message);
      }
    } else {
      moduleResults.push({
        ...m,
        hasRun: false,
        summary: null,
      });
    }
  }

  const executedModules = moduleResults.filter((m) => m.hasRun);
  const totalTests = executedModules.reduce((acc, m) => acc + (m.summary?.total || 0), 0);
  const totalPassed = executedModules.reduce((acc, m) => acc + (m.summary?.passed || 0), 0);
  const totalFailed = executedModules.reduce((acc, m) => acc + (m.summary?.failed || 0), 0);
  const totalSkipped = executedModules.reduce((acc, m) => acc + (m.summary?.skipped || 0), 0);
  const totalDurationMs = executedModules.reduce((acc, m) => acc + (m.summary?.totalDuration || 0), 0);
  const overallPassRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  const timestamp = new Date().toLocaleString();

  // 1. Generate Master HTML
  const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zippiee Driver – Multi-Module Automation Dashboard</title>
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
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
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

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
      margin-bottom: 36px;
    }
    .module-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s, border-color 0.15s;
    }
    .module-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .module-title { font-size: 17px; font-weight: 700; color: #fff; }
    .module-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }
    .tracker-tag {
      font-size: 11px;
      font-family: monospace;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      padding: 3px 8px;
      border-radius: 4px;
      color: #cbd5e1;
      display: inline-block;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge.passed { background: rgba(16, 185, 129, 0.15); color: var(--pass); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge.failed { background: rgba(239, 68, 68, 0.15); color: var(--fail); border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge.not-run { background: rgba(148, 163, 184, 0.1); color: var(--text-muted); border: 1px solid rgba(148, 163, 184, 0.2); }

    .module-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      margin-top: auto;
    }
    .btn-view {
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      display: inline-block;
      transition: background 0.2s;
    }
    .btn-view:hover { background: #2563eb; }
    .btn-disabled {
      background: #334155;
      color: #94a3b8;
      cursor: not-allowed;
    }

    .tracker-table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 24px;
    }
    .table-title {
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th {
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.2);
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
    }
    tr:last-child td { border-bottom: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Zippiee Driver – Multi-Module Automation Dashboard</h1>
      <div class="subtitle">Generated: ${timestamp} &bull; Staging Backend &bull; WebdriverIO + Appium Flutter Driver</div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Modules Executed</span>
        <span class="stat-value">${executedModules.length} / ${MODULES.length}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Total Tests</span>
        <span class="stat-value">${totalTests}</span>
      </div>
      <div class="stat-card passed">
        <span class="stat-label">Total Passed</span>
        <span class="stat-value">${totalPassed}</span>
      </div>
      <div class="stat-card failed">
        <span class="stat-label">Total Failed</span>
        <span class="stat-value">${totalFailed}</span>
      </div>
      <div class="stat-card rate">
        <span class="stat-label">Pass Rate</span>
        <span class="stat-value">${overallPassRate}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Total Duration</span>
        <span class="stat-value">${(totalDurationMs / 1000).toFixed(1)}s</span>
      </div>
    </div>

    <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Individual Module Reports</h2>
    <div class="module-grid">
      ${moduleResults.map((m) => {
        const relativeReportPath = `${path.basename(m.outputDir)}/index.html`;
        const hasPassed = m.hasRun && (m.summary?.failed === 0);
        const statusBadge = !m.hasRun
          ? `<span class="badge not-run">Not Executed</span>`
          : hasPassed
          ? `<span class="badge passed">${m.summary.passed}/${m.summary.total} Passed (100%)</span>`
          : `<span class="badge failed">${m.summary.failed} Failed</span>`;

        return `
          <div class="module-card">
            <div>
              <div class="module-header">
                <span class="module-title">${m.name}</span>
                ${statusBadge}
              </div>
              <div class="module-desc">${m.description}</div>
              <div class="tracker-tag">Coverage: ${m.trackerCodes}</div>
            </div>
            <div class="module-footer">
              <span style="font-size: 12px; color: var(--text-muted); font-family: monospace;">
                ${m.hasRun ? `${(m.summary.totalDuration / 1000).toFixed(1)}s duration` : 'Pending run'}
              </span>
              ${
                m.hasRun
                  ? `<a href="${relativeReportPath}" class="btn-view">View Module Report →</a>`
                  : `<span class="btn-view btn-disabled">No Report Yet</span>`
              }
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="tracker-table-container">
      <div class="table-title">Manual Test Tracker Specification & Module Mapping</div>
      <table>
        <thead>
          <tr>
            <th>Module Name</th>
            <th>Manual Tracker Scope</th>
            <th>Target Suite</th>
            <th>Automated Cases</th>
            <th>Status</th>
            <th>Report Action</th>
          </tr>
        </thead>
        <tbody>
          ${moduleResults.map((m) => {
            const relPath = `${path.basename(m.outputDir)}/index.html`;
            return `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td><code>${m.trackerCodes}</code></td>
                <td><code>--suite ${m.suite}</code></td>
                <td>${m.hasRun ? `${m.summary.total} tests` : '-'}</td>
                <td>${m.hasRun ? (m.summary.failed === 0 ? '<span style="color:var(--pass);">✔ Passed</span>' : '<span style="color:var(--fail);">✖ Failed</span>') : '<span style="color:var(--text-muted);">Not Run</span>'}</td>
                <td>${m.hasRun ? `<a href="${relPath}" style="color:var(--accent); font-weight:600; text-decoration:none;">Open Report ↗</a>` : '-'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(resolvedDir, 'index.html'), masterHtml, 'utf-8');

  // 2. Generate Master Markdown
  let masterMd = `# Zippiee Driver – Multi-Module Test Automation Dashboard\n\n`;
  masterMd += `> **Execution Timestamp:** ${timestamp}  \n`;
  masterMd += `> **Total Duration:** ${(totalDurationMs / 1000).toFixed(1)}s  \n`;
  masterMd += `> **Summary:** ${totalPassed} Passed, ${totalFailed} Failed, ${totalSkipped} Skipped (${overallPassRate}% Pass Rate)\n\n`;
  masterMd += `| Module | Tracker Codes Covered | Tests | Pass Rate | Duration | Report Link |\n|---|---|---|---|---|---|\n`;

  for (const m of moduleResults) {
    if (m.hasRun) {
      const s = m.summary;
      masterMd += `| **${m.name}** | \`${m.trackerCodes}\` | ${s.total} | ${s.passRate}% | ${(s.totalDuration / 1000).toFixed(1)}s | [View Report](./${path.basename(m.outputDir)}/report.md) |\n`;
    } else {
      masterMd += `| **${m.name}** | \`${m.trackerCodes}\` | - | - | - | Not Executed |\n`;
    }
  }

  fs.writeFileSync(path.join(resolvedDir, 'report.md'), masterMd, 'utf-8');
  console.log(`\n\x1b[32m✔\x1b[0m Master Dashboard updated: file://${path.join(resolvedDir, 'index.html')}\n`);
}

function runCommand(command, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n\x1b[36m▶ Running:\x1b[0m ${command}\n`);
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.warn(`\x1b[33m⚠ Command exited with code ${code}\x1b[0m`);
        resolve(); // Continue running next modules even if one fails
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const targetModuleId = args[0]?.replace(/^--module=/, '').replace(/^--module/, args[1] || '');

  let modulesToRun = MODULES;
  if (targetModuleId) {
    modulesToRun = MODULES.filter((m) => m.id === targetModuleId || m.suite === targetModuleId);
    if (modulesToRun.length === 0) {
      console.error(`Module "${targetModuleId}" not found. Available modules: ${MODULES.map((m) => m.suite).join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`\n======================================================`);
  console.log(`  Zippiee Driver: Running ${modulesToRun.length} module(s) one by one`);
  console.log(`======================================================\n`);

  for (const [idx, m] of modulesToRun.entries()) {
    console.log(`\n[${idx + 1}/${modulesToRun.length}] >>> Starting ${m.name} <<<`);
    console.log(`Tracker Coverage: ${m.trackerCodes}`);
    console.log(`Output Directory: ${m.outputDir}\n`);

    const cmd = `npx wdio run wdio.conf.js --suite ${m.suite}`;
    await runCommand(cmd, {
      REPORT_DIR: m.outputDir,
      MODULE_NAME: m.name,
    });

    generateMasterDashboard('./reports');
  }

  console.log(`\n======================================================`);
  console.log(`  All requested modules finished!`);
  console.log(`  Master Dashboard: file://${path.resolve('./reports/index.html')}`);
  console.log(`======================================================\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((err) => {
    console.error('Execution error:', err);
    process.exit(1);
  });
}
