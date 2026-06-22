const maturityLabels = [
  'Inexistant',
  'Initial',
  'Répétable',
  'Défini',
  'Maîtrisé',
  'Optimisé',
];

const effortLabels = {
  1: 'Faible',
  2: 'Modéré',
  3: 'Significatif',
  4: 'Important',
  5: 'Très important',
};

const requirements = [
  {
    id: 'mitre-initial-access',
    framework: 'MITRE ATT&CK',
    domain: 'Couverture tactique',
    title: 'Détecter les accès initiaux',
    description:
      "Cartographier et détecter les techniques d'accès initial pertinentes : phishing, comptes valides, services exposés et exploitation applicative.",
    defaultCriticality: 5,
    defaultEffort: 3,
  },
  {
    id: 'mitre-lateral-movement',
    framework: 'MITRE ATT&CK',
    domain: 'Couverture tactique',
    title: 'Surveiller les mouvements latéraux',
    description:
      'Identifier les chemins de propagation, les authentifications anormales et les usages suspects des outils d’administration.',
    defaultCriticality: 5,
    defaultEffort: 4,
  },
  {
    id: 'mitre-detection-engineering',
    framework: 'MITRE ATT&CK',
    domain: 'Cas d’usage SOC',
    title: 'Industrialiser le detection engineering',
    description:
      'Relier les cas d’usage aux tactiques, techniques, sources de données, tests adverses et indicateurs de performance.',
    defaultCriticality: 4,
    defaultEffort: 4,
  },
  {
    id: 'pdis-governance',
    framework: 'PDIS ANSSI',
    domain: 'Gouvernance',
    title: 'Formaliser le périmètre et les responsabilités',
    description:
      'Définir le périmètre de supervision, les engagements, les rôles, les responsabilités et les modalités de pilotage de la prestation.',
    defaultCriticality: 5,
    defaultEffort: 3,
  },
  {
    id: 'pdis-traceability',
    framework: 'PDIS ANSSI',
    domain: 'Sécurité du service',
    title: 'Assurer la traçabilité des actions SOC',
    description:
      'Tracer les accès, investigations, changements de règles, escalades et actions opérées dans les environnements supervisés.',
    defaultCriticality: 4,
    defaultEffort: 3,
  },
  {
    id: 'pdis-skills',
    framework: 'PDIS ANSSI',
    domain: 'Personnel',
    title: 'Maintenir les compétences analystes',
    description:
      'Structurer les rôles, formations, habilitations, revues de compétence et mécanismes de continuité opérationnelle.',
    defaultCriticality: 4,
    defaultEffort: 2,
  },
  {
    id: 'sim3-mandate',
    framework: 'SIM3',
    domain: 'Organisation',
    title: 'Clarifier le mandat du SOC',
    description:
      'Expliciter la mission, l’autorité, les parties prenantes, les services rendus et les critères de succès du SOC.',
    defaultCriticality: 5,
    defaultEffort: 2,
  },
  {
    id: 'sim3-incident-process',
    framework: 'SIM3',
    domain: 'Processus',
    title: 'Maîtriser le processus incident',
    description:
      'Définir classification, qualification, escalade, notification, coordination de réponse et retour d’expérience.',
    defaultCriticality: 5,
    defaultEffort: 3,
  },
  {
    id: 'sim3-tooling',
    framework: 'SIM3',
    domain: 'Outils',
    title: 'Outiller la chaîne de détection',
    description:
      'Aligner SIEM, EDR, threat intelligence, ticketing, automatisation et tableaux de bord avec les processus SOC.',
    defaultCriticality: 4,
    defaultEffort: 5,
  },
];

const state = {
  context: {
    organisation: 'Organisation exemple',
    sector: 'Services numériques',
    objective: 'Définir une roadmap SOC pragmatique et priorisée',
  },
  selectedFrameworks: new Set(['MITRE ATT&CK', 'PDIS ANSSI', 'SIM3']),
  assessments: Object.fromEntries(
    requirements.map((requirement) => [
      requirement.id,
      {
        applicable: true,
        current: 1,
        target: 3,
        criticality: requirement.defaultCriticality,
        effort: requirement.defaultEffort,
        comment: '',
      },
    ]),
  ),
};

const app = document.querySelector('#app');

function scoreRequirement(requirement) {
  const assessment = state.assessments[requirement.id];
  const gap = Math.max(assessment.target - assessment.current, 0);
  const feasibility = 6 - assessment.effort;
  return gap * assessment.criticality * feasibility;
}

function priorityLabel(score) {
  if (score >= 45) return 'Très haute';
  if (score >= 25) return 'Haute';
  if (score >= 10) return 'Moyenne';
  return 'Basse';
}

function phaseLabel(score) {
  if (score >= 45) return '0–3 mois';
  if (score >= 25) return '3–6 mois';
  if (score >= 10) return '6–12 mois';
  return 'Backlog';
}

function selectedRequirements() {
  return requirements.filter(
    (requirement) =>
      state.selectedFrameworks.has(requirement.framework) &&
      state.assessments[requirement.id].applicable,
  );
}

function strategyItems() {
  return selectedRequirements()
    .map((requirement) => {
      const assessment = state.assessments[requirement.id];
      const score = scoreRequirement(requirement);
      return {
        ...requirement,
        ...assessment,
        gap: Math.max(assessment.target - assessment.current, 0),
        score,
        priority: priorityLabel(score),
        phase: phaseLabel(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function render() {
  const items = strategyItems();
  const averageCurrent = items.length
    ? items.reduce((sum, item) => sum + Number(item.current), 0) / items.length
    : 0;
  const averageTarget = items.length
    ? items.reduce((sum, item) => sum + Number(item.target), 0) / items.length
    : 0;

  app.innerHTML = `
    <header class="hero">
      <div>
        <p class="eyebrow">MVP stratégie SOC</p>
        <h1>Construire une stratégie SOC depuis MITRE ATT&CK, PDIS et SIM3</h1>
        <p class="hero__text">Sélectionnez les référentiels et exigences applicables, évaluez manuellement la maturité, puis obtenez une roadmap d’implémentation priorisée.</p>
      </div>
      <div class="hero__card">
        <span>Maturité actuelle</span>
        <strong>${averageCurrent.toFixed(1)} / 5</strong>
        <span>Cible moyenne</span>
        <strong>${averageTarget.toFixed(1)} / 5</strong>
      </div>
    </header>

    <main class="layout">
      <section class="panel">
        <h2>1. Contexte</h2>
        <div class="grid three">
          ${contextInput('organisation', 'Organisation')}
          ${contextInput('sector', 'Secteur')}
          ${contextInput('objective', 'Objectif')}
        </div>
      </section>

      <section class="panel">
        <h2>2. Sélection des référentiels</h2>
        <div class="frameworks">
          ${['MITRE ATT&CK', 'PDIS ANSSI', 'SIM3']
            .map(
              (framework) => `
                <label class="framework-card">
                  <input type="checkbox" data-framework="${framework}" ${state.selectedFrameworks.has(framework) ? 'checked' : ''} />
                  <span>${framework}</span>
                </label>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="panel">
        <h2>3. Exigences et évaluation de maturité</h2>
        <div class="requirements">
          ${requirements
            .filter((requirement) => state.selectedFrameworks.has(requirement.framework))
            .map(requirementCard)
            .join('')}
        </div>
      </section>

      <section class="panel strategy">
        <div class="section-heading">
          <div>
            <h2>4. Stratégie d’implémentation</h2>
            <p>Les chantiers sont ordonnés selon l’écart de maturité, la criticité et la faisabilité.</p>
          </div>
          <button id="export-json">Exporter JSON</button>
        </div>
        ${renderStrategy(items)}
      </section>
    </main>
  `;

  bindEvents();
}

function contextInput(key, label) {
  return `
    <label class="field">
      <span>${label}</span>
      <input data-context="${key}" value="${state.context[key]}" />
    </label>
  `;
}

function requirementCard(requirement) {
  const assessment = state.assessments[requirement.id];
  const score = scoreRequirement(requirement);
  const gap = Math.max(assessment.target - assessment.current, 0);

  return `
    <article class="requirement ${assessment.applicable ? '' : 'muted'}">
      <div class="requirement__header">
        <label class="toggle">
          <input type="checkbox" data-applicable="${requirement.id}" ${assessment.applicable ? 'checked' : ''} />
          <span>Applicable</span>
        </label>
        <span class="tag">${requirement.framework}</span>
      </div>
      <h3>${requirement.title}</h3>
      <p>${requirement.description}</p>
      <small>${requirement.domain}</small>

      <div class="controls">
        ${rangeControl(requirement.id, 'current', 'Actuel', assessment.current)}
        ${rangeControl(requirement.id, 'target', 'Cible', assessment.target)}
        ${rangeControl(requirement.id, 'criticality', 'Criticité', assessment.criticality)}
        ${rangeControl(requirement.id, 'effort', 'Effort', assessment.effort)}
      </div>

      <label class="field">
        <span>Commentaire / preuve</span>
        <textarea data-comment="${requirement.id}" placeholder="Justification de la note, preuve disponible, hypothèse...">${assessment.comment}</textarea>
      </label>

      <div class="result-line">
        <span>Écart : <strong>${gap}</strong></span>
        <span>Score : <strong>${score}</strong></span>
        <span>Priorité : <strong>${priorityLabel(score)}</strong></span>
      </div>
    </article>
  `;
}

function rangeControl(id, field, label, value) {
  const helper = field === 'current' || field === 'target' ? maturityLabels[value] : effortLabels[value] ?? value;
  return `
    <label class="range-field">
      <span>${label}: <strong>${value}</strong></span>
      <input type="range" min="0" max="5" data-assessment-id="${id}" data-assessment-field="${field}" value="${value}" />
      <small>${helper}</small>
    </label>
  `;
}

function renderStrategy(items) {
  if (!items.length) {
    return '<p class="empty">Aucune exigence applicable sélectionnée.</p>';
  }

  const phases = ['0–3 mois', '3–6 mois', '6–12 mois', 'Backlog'];

  return `
    <div class="timeline">
      ${phases
        .map((phase) => {
          const phaseItems = items.filter((item) => item.phase === phase);
          return `
            <div class="phase">
              <h3>${phase}</h3>
              ${phaseItems.length ? phaseItems.map(strategyCard).join('') : '<p class="empty">Aucun chantier</p>'}
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function strategyCard(item) {
  return `
    <article class="strategy-card">
      <span class="tag">${item.framework}</span>
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      <ul>
        <li>Maturité : ${item.current} → ${item.target} (${item.gap} niveau(x) d’écart)</li>
        <li>Priorité : ${item.priority} · Score ${item.score}</li>
        <li>Action : formaliser, outiller, tester puis mesurer le dispositif.</li>
      </ul>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-framework]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (event.target.checked) state.selectedFrameworks.add(event.target.dataset.framework);
      else state.selectedFrameworks.delete(event.target.dataset.framework);
      render();
    });
  });

  document.querySelectorAll('[data-context]').forEach((input) => {
    input.addEventListener('input', (event) => {
      state.context[event.target.dataset.context] = event.target.value;
    });
  });

  document.querySelectorAll('[data-applicable]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      state.assessments[event.target.dataset.applicable].applicable = event.target.checked;
      render();
    });
  });

  document.querySelectorAll('[data-assessment-id]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const { assessmentId, assessmentField } = event.target.dataset;
      state.assessments[assessmentId][assessmentField] = Number(event.target.value);
      render();
    });
  });

  document.querySelectorAll('[data-comment]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      state.assessments[event.target.dataset.comment].comment = event.target.value;
    });
  });

  document.querySelector('#export-json').addEventListener('click', () => {
    const payload = JSON.stringify({ context: state.context, strategy: strategyItems() }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'strategie-soc.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

render();
