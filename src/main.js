const threatProfiles = {
  ransomware: 'Ransomware',
  bec: 'Compromission de compte / BEC',
  apt: 'Espionnage / APT',
  insider: 'Menace interne',
};

const statusOrder = ['blind', 'partial', 'covered'];

const statusMeta = {
  blind: { label: 'Aveugle', className: 'status-blind' },
  partial: { label: 'Partielle', className: 'status-partial' },
  covered: { label: 'Couverte', className: 'status-covered' },
};

// Sous-ensemble représentatif d'ATT&CK Enterprise (2 techniques par tactique).
// weight[<profil>] = pertinence (1-5) de la technique pour ce scénario de menace.
const techniques = [
  { id: 'T1598', tactic: 'Reconnaissance', name: 'Phishing for Information', dataSources: ['Passerelle e-mail'], weight: { ransomware: 2, bec: 3, apt: 4, insider: 1 } },
  { id: 'T1593', tactic: 'Reconnaissance', name: 'Search Open Websites/Domains', dataSources: ['Threat intelligence externe'], weight: { ransomware: 1, bec: 2, apt: 4, insider: 1 } },

  { id: 'T1583', tactic: 'Resource Development', name: 'Acquire Infrastructure', dataSources: ['Threat intelligence externe'], weight: { ransomware: 2, bec: 2, apt: 4, insider: 1 } },
  { id: 'T1586', tactic: 'Resource Development', name: 'Compromise Accounts', dataSources: ['Threat intelligence externe', 'Annuaire / IAM'], weight: { ransomware: 2, bec: 5, apt: 3, insider: 1 } },

  { id: 'T1566', tactic: 'Initial Access', name: 'Phishing', dataSources: ['Passerelle e-mail', 'EDR'], weight: { ransomware: 5, bec: 5, apt: 4, insider: 1 } },
  { id: 'T1190', tactic: 'Initial Access', name: 'Exploit Public-Facing Application', dataSources: ['WAF', 'Logs applicatifs'], weight: { ransomware: 4, bec: 1, apt: 4, insider: 1 } },
  { id: 'T1078', tactic: 'Initial Access', name: 'Valid Accounts', dataSources: ['Annuaire / IAM', 'VPN / Auth'], weight: { ransomware: 3, bec: 5, apt: 5, insider: 5 } },

  { id: 'T1059', tactic: 'Execution', name: 'Command and Scripting Interpreter', dataSources: ['EDR (création de processus)'], weight: { ransomware: 4, bec: 2, apt: 5, insider: 2 } },
  { id: 'T1204', tactic: 'Execution', name: 'User Execution', dataSources: ['EDR (création de processus)', 'Passerelle e-mail'], weight: { ransomware: 5, bec: 3, apt: 3, insider: 1 } },

  { id: 'T1547', tactic: 'Persistence', name: 'Boot or Logon Autostart Execution', dataSources: ['EDR (registre / autoruns)'], weight: { ransomware: 3, bec: 1, apt: 4, insider: 1 } },
  { id: 'T1098', tactic: 'Persistence', name: 'Account Manipulation', dataSources: ['Annuaire / IAM'], weight: { ransomware: 2, bec: 4, apt: 4, insider: 4 } },

  { id: 'T1068', tactic: 'Privilege Escalation', name: 'Exploitation for Privilege Escalation', dataSources: ['EDR', 'Logs systeme'], weight: { ransomware: 3, bec: 1, apt: 4, insider: 2 } },
  { id: 'T1055', tactic: 'Privilege Escalation', name: 'Process Injection', dataSources: ['EDR (mémoire / processus)'], weight: { ransomware: 3, bec: 1, apt: 4, insider: 1 } },

  { id: 'T1027', tactic: 'Defense Evasion', name: 'Obfuscated Files or Information', dataSources: ['EDR', 'Sandbox / antivirus'], weight: { ransomware: 4, bec: 2, apt: 5, insider: 1 } },
  { id: 'T1070', tactic: 'Defense Evasion', name: 'Indicator Removal', dataSources: ['EDR', 'Logs systeme centralisés'], weight: { ransomware: 4, bec: 2, apt: 5, insider: 2 } },

  { id: 'T1110', tactic: 'Credential Access', name: 'Brute Force', dataSources: ['Annuaire / IAM', 'VPN / Auth'], weight: { ransomware: 3, bec: 4, apt: 3, insider: 1 } },
  { id: 'T1003', tactic: 'Credential Access', name: 'OS Credential Dumping', dataSources: ['EDR (accès LSASS)'], weight: { ransomware: 4, bec: 2, apt: 5, insider: 2 } },

  { id: 'T1082', tactic: 'Discovery', name: 'System Information Discovery', dataSources: ['EDR (création de processus)'], weight: { ransomware: 2, bec: 1, apt: 3, insider: 1 } },
  { id: 'T1087', tactic: 'Discovery', name: 'Account Discovery', dataSources: ['Annuaire / IAM'], weight: { ransomware: 2, bec: 2, apt: 4, insider: 2 } },

  { id: 'T1021', tactic: 'Lateral Movement', name: 'Remote Services', dataSources: ['Auth réseau', 'EDR'], weight: { ransomware: 5, bec: 2, apt: 4, insider: 3 } },
  { id: 'T1080', tactic: 'Lateral Movement', name: 'Taint Shared Content', dataSources: ['Partages fichiers', 'EDR'], weight: { ransomware: 3, bec: 1, apt: 2, insider: 1 } },

  { id: 'T1560', tactic: 'Collection', name: 'Archive Collected Data', dataSources: ['EDR', 'Proxy / Web'], weight: { ransomware: 2, bec: 1, apt: 4, insider: 3 } },
  { id: 'T1114', tactic: 'Collection', name: 'Email Collection', dataSources: ['Logs messagerie / Cloud audit'], weight: { ransomware: 1, bec: 5, apt: 4, insider: 3 } },

  { id: 'T1071', tactic: 'Command and Control', name: 'Application Layer Protocol', dataSources: ['Proxy / Web', 'DNS'], weight: { ransomware: 4, bec: 1, apt: 5, insider: 1 } },
  { id: 'T1572', tactic: 'Command and Control', name: 'Protocol Tunneling', dataSources: ['Proxy / Web', 'Firewall / NetFlow'], weight: { ransomware: 3, bec: 1, apt: 5, insider: 1 } },

  { id: 'T1041', tactic: 'Exfiltration', name: 'Exfiltration Over C2 Channel', dataSources: ['Proxy / Web', 'Firewall / NetFlow'], weight: { ransomware: 3, bec: 2, apt: 5, insider: 3 } },
  { id: 'T1567', tactic: 'Exfiltration', name: 'Exfiltration Over Web Service', dataSources: ['Proxy / Web', 'Cloud audit'], weight: { ransomware: 2, bec: 3, apt: 4, insider: 4 } },

  { id: 'T1486', tactic: 'Impact', name: 'Data Encrypted for Impact', dataSources: ['EDR', 'Sauvegardes / monitoring fichiers'], weight: { ransomware: 5, bec: 1, apt: 1, insider: 2 } },
  { id: 'T1490', tactic: 'Impact', name: 'Inhibit System Recovery', dataSources: ['EDR', 'Logs systeme'], weight: { ransomware: 5, bec: 1, apt: 1, insider: 1 } },
];

const tactics = [...new Set(techniques.map((technique) => technique.tactic))];

// Statut de départ volontairement hétérogène pour illustrer une vraie photographie de couverture.
const initialCoverage = {
  T1078: 'covered', T1566: 'partial', T1059: 'covered', T1003: 'partial',
  T1021: 'partial', T1486: 'partial', T1071: 'blind', T1572: 'blind',
  T1567: 'blind', T1041: 'blind', T1114: 'blind', T1098: 'partial',
};

const storageKey = 'trainingsteerco-state';
const themeStorageKey = 'trainingsteerco-theme';

const defaultContext = {
  organisation: 'Organisation exemple',
  objectif: 'Réduire les angles morts de détection face aux menaces prioritaires',
};

const defaultThreatProfile = 'ransomware';

function buildInitialCoverage() {
  return Object.fromEntries(
    techniques.map((technique) => [technique.id, initialCoverage[technique.id] ?? 'blind']),
  );
}

const state = {
  context: { ...defaultContext },
  threatProfile: defaultThreatProfile,
  coverage: buildInitialCoverage(),
};

const app = document.querySelector('#app');

// Le contenu stocké peut dater d'une version antérieure du jeu de techniques :
// chaque valeur est validée avant d'être reprise dans l'état.
function loadState() {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return;
  }

  if (!stored || typeof stored !== 'object') return;

  if (stored.context && typeof stored.context === 'object') {
    for (const key of Object.keys(defaultContext)) {
      if (typeof stored.context[key] === 'string') {
        state.context[key] = stored.context[key];
      }
    }
  }

  if (Object.hasOwn(threatProfiles, stored.threatProfile)) {
    state.threatProfile = stored.threatProfile;
  }

  if (stored.coverage && typeof stored.coverage === 'object') {
    for (const technique of techniques) {
      const status = stored.coverage[technique.id];
      if (statusOrder.includes(status)) {
        state.coverage[technique.id] = status;
      }
    }
  }
}

function saveState() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        context: state.context,
        threatProfile: state.threatProfile,
        coverage: state.coverage,
      }),
    );
  } catch {
    // Stockage indisponible (navigation privée, quota) : l'application reste utilisable en mémoire.
  }
}

function resetState() {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Rien à nettoyer si le stockage est indisponible.
  }
  state.context = { ...defaultContext };
  state.threatProfile = defaultThreatProfile;
  state.coverage = buildInitialCoverage();
  render();
}

function gapFactor(status) {
  if (status === 'covered') return 0;
  if (status === 'partial') return 0.5;
  return 1;
}

function coverageFactor(status) {
  if (status === 'covered') return 1;
  if (status === 'partial') return 0.5;
  return 0;
}

function priorityScore(technique) {
  const weight = technique.weight[state.threatProfile];
  const status = state.coverage[technique.id];
  return Math.round(weight * gapFactor(status) * 10) / 10;
}

function weightedCoveragePct() {
  const totalWeight = techniques.reduce((sum, technique) => sum + technique.weight[state.threatProfile], 0);
  const coveredWeight = techniques.reduce(
    (sum, technique) => sum + technique.weight[state.threatProfile] * coverageFactor(state.coverage[technique.id]),
    0,
  );
  return totalWeight ? (coveredWeight / totalWeight) * 100 : 0;
}

function actionPlan() {
  return techniques
    .map((technique) => ({ technique, score: priorityScore(technique) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function render() {
  const coveragePct = weightedCoveragePct();
  const plan = actionPlan();
  const topGaps = plan.slice(0, 5);

  app.innerHTML = `
    <header class="hero">
      <div>
        <p class="eyebrow">MVP stratégie SOC</p>
        <h1>Cartographier la couverture de détection face aux menaces réelles</h1>
        <p class="hero__text">Évaluez la couverture ATT&CK technique par technique, pondérée par le scénario de menace qui compte pour votre organisation, et obtenez les angles morts à traiter en priorité.</p>
      </div>
      <div class="hero__card">
        <span>Couverture pondérée</span>
        <strong>${coveragePct.toFixed(0)} %</strong>
        <span>Scénario actif</span>
        <strong class="hero__threat">${threatProfiles[state.threatProfile]}</strong>
      </div>
    </header>

    <main class="layout">
      <section class="panel">
        <h2>1. Contexte</h2>
        <div class="grid two">
          ${contextInput('organisation', 'Organisation')}
          ${contextInput('objectif', 'Objectif')}
        </div>
      </section>

      <section class="panel">
        <h2>2. Scénario de menace prioritaire</h2>
        <p class="panel__hint">Le scénario sélectionné pondère l'importance de chaque technique dans la heatmap et le plan d'action.</p>
        <div class="threats">
          ${Object.entries(threatProfiles)
            .map(
              ([key, label]) => `
                <label class="threat-card ${state.threatProfile === key ? 'active' : ''}">
                  <input type="radio" name="threat" value="${key}" ${state.threatProfile === key ? 'checked' : ''} />
                  <span>${label}</span>
                </label>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="panel">
        <h2>3. Heatmap de couverture ATT&CK</h2>
        <p class="panel__hint">Cliquez sur une technique pour faire tourner son statut : aveugle → partielle → couverte. La bordure indique la pertinence pour le scénario sélectionné.</p>
        <div class="legend">
          <span><i class="dot status-blind"></i> Aveugle</span>
          <span><i class="dot status-partial"></i> Partielle</span>
          <span><i class="dot status-covered"></i> Couverte</span>
          <span><i class="dot weight-high"></i> Forte pertinence pour le scénario</span>
        </div>
        <div class="heatmap">
          ${tactics.map((tactic) => tacticColumn(tactic)).join('')}
        </div>
      </section>

      <section class="panel strategy">
        <div class="section-heading">
          <div>
            <h2>4. Plan d'action priorisé</h2>
            <p>Classé par pertinence pour le scénario de menace × écart de couverture.</p>
          </div>
          <div class="section-heading__actions">
            <button id="reset-state" class="button-secondary">Réinitialiser</button>
            <button id="export-json">Exporter JSON</button>
          </div>
        </div>
        ${renderActionPlan(plan)}
      </section>

      <section class="panel">
        <h2>5. Synthèse pour le comité de pilotage</h2>
        ${renderSummary(coveragePct, topGaps)}
      </section>
    </main>
  `;

  bindEvents();
}

// Le rendu se fait par interpolation de chaînes : les valeurs saisies par
// l'utilisateur doivent être échappées avant d'atterrir dans un attribut.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function contextInput(key, label) {
  return `
    <label class="field">
      <span>${label}</span>
      <input data-context="${key}" value="${escapeHtml(state.context[key])}" />
    </label>
  `;
}

function tacticColumn(tactic) {
  const tacticTechniques = techniques.filter((technique) => technique.tactic === tactic);
  return `
    <div class="tactic-column">
      <h3>${tactic}</h3>
      ${tacticTechniques.map(techniqueCell).join('')}
    </div>
  `;
}

function techniqueCell(technique) {
  const status = state.coverage[technique.id];
  const meta = statusMeta[status];
  const weight = technique.weight[state.threatProfile];
  const weightClass = weight >= 4 ? 'weight-high' : weight >= 2 ? 'weight-medium' : 'weight-low';
  const title = `${technique.id} · ${technique.name}\nPertinence (${threatProfiles[state.threatProfile]}) : ${weight}/5\nStatut : ${meta.label}\nSources de log : ${technique.dataSources.join(', ')}`;
  // La pertinence n'est signalée visuellement que par la bordure : l'aria-label
  // la restitue, ainsi que la tactique et le statut, pour les lecteurs d'écran.
  const ariaLabel = `${technique.id} ${technique.name}, tactique ${technique.tactic}, pertinence ${weight} sur 5 pour le scénario ${threatProfiles[state.threatProfile]}, statut : ${meta.label}`;
  return `
    <button class="technique-cell ${meta.className} ${weightClass}" data-technique="${technique.id}" title="${title}" aria-label="${ariaLabel}">
      <span class="technique-id">${technique.id}</span>
      <span class="technique-name">${technique.name}</span>
      <span class="technique-status">${meta.label}</span>
    </button>
  `;
}

function renderActionPlan(plan) {
  if (!plan.length) {
    return '<p class="empty">Couverture complète pour ce scénario : aucun angle mort détecté.</p>';
  }

  return `
    <ol class="action-list">
      ${plan
        .slice(0, 10)
        .map(
          ({ technique, score }) => `
            <li>
              <div class="action-list__header">
                <span class="tag">${technique.tactic}</span>
                <strong>${technique.id} · ${technique.name}</strong>
                <span class="score">Priorité ${score}</span>
              </div>
              <p>Statut actuel : <strong>${statusMeta[state.coverage[technique.id]].label}</strong> · Sources de log à mobiliser : ${technique.dataSources.join(', ')}.</p>
            </li>
          `,
        )
        .join('')}
    </ol>
  `;
}

function renderSummary(coveragePct, topGaps) {
  const missingSources = [...new Set(topGaps.flatMap((item) => item.technique.dataSources))];

  return `
    <p>
      Face au scénario <strong>${threatProfiles[state.threatProfile]}</strong>, la couverture de détection pondérée
      est de <strong>${coveragePct.toFixed(0)} %</strong>.
      ${
        topGaps.length
          ? `Les angles morts les plus critiques concernent ${topGaps
              .map((item) => item.technique.id)
              .join(', ')}.
             Pour les réduire, les sources de log à instrumenter ou raccorder en priorité sont :
             <strong>${missingSources.join(', ')}</strong>.`
          : 'Aucun angle mort prioritaire identifié pour ce scénario : la couverture actuelle est jugée suffisante.'
      }
    </p>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-context]').forEach((input) => {
    input.addEventListener('input', (event) => {
      state.context[event.target.dataset.context] = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll('input[name="threat"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.threatProfile = event.target.value;
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-technique]').forEach((cell) => {
    cell.addEventListener('click', (event) => {
      const id = event.currentTarget.dataset.technique;
      const currentIndex = statusOrder.indexOf(state.coverage[id]);
      state.coverage[id] = statusOrder[(currentIndex + 1) % statusOrder.length];
      saveState();
      render();
      // render() reconstruit tout le DOM : sans cela, le focus clavier serait perdu.
      document.querySelector(`[data-technique="${id}"]`)?.focus();
    });
  });

  document.querySelector('#reset-state').addEventListener('click', resetState);

  document.querySelector('#export-json').addEventListener('click', () => {
    const payload = JSON.stringify(
      {
        context: state.context,
        threatProfile: threatProfiles[state.threatProfile],
        coveragePct: Math.round(weightedCoveragePct()),
        actionPlan: actionPlan().map(({ technique, score }) => ({
          id: technique.id,
          name: technique.name,
          tactic: technique.tactic,
          status: state.coverage[technique.id],
          score,
          dataSources: technique.dataSources,
        })),
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'couverture-soc.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

// Le bouton de thème vit hors de #app (voir index.html) : contrairement au
// reste de l'interface, il n'est jamais recréé par render(), donc son
// écouteur se branche une seule fois ici plutôt que dans bindEvents().
const themeToggle = document.querySelector('#theme-toggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
}

function initTheme() {
  let stored;
  try {
    stored = localStorage.getItem(themeStorageKey);
  } catch {
    stored = null;
  }
  const theme = stored === 'dark' || stored === 'light'
    ? stored
    : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(theme);
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(themeStorageKey, next);
  } catch {
    // Stockage indisponible : le thème reste actif pour la session en cours.
  }
});

initTheme();
loadState();
render();
