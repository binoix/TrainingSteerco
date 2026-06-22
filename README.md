# TrainingSteerco

MVP d’application web interactive pour définir une stratégie SOC à partir de MITRE ATT&CK, du référentiel PDIS de l’ANSSI et du modèle SIM3.

## Fonctionnalités

- Sélection des référentiels à prendre en compte : MITRE ATT&CK, PDIS ANSSI et SIM3.
- Catalogue initial d’exigences structurées par référentiel et domaine.
- Évaluation manuelle de chaque exigence : applicabilité, maturité actuelle, maturité cible, criticité, effort et commentaire de justification.
- Calcul d’un score de priorité à partir de l’écart de maturité, de la criticité et de la faisabilité.
- Génération automatique d’une stratégie d’implémentation sous forme de roadmap 0–3 mois, 3–6 mois, 6–12 mois et backlog.
- Export JSON du contexte et de la stratégie priorisée.

## Démarrage

```bash
npm run start
```

L’application est ensuite disponible sur http://localhost:5173/.

## Build de production

```bash
npm run build
```

## Accès depuis GitHub Pages

L’application est statique : GitHub Pages peut donc servir directement les fichiers du dépôt.

1. Pousser la branche contenant `index.html` à la racine du dépôt sur GitHub.
2. Dans GitHub, ouvrir **Settings** → **Pages**.
3. Dans **Build and deployment**, choisir **Deploy from a branch**.
4. Sélectionner la branche à publier, puis le dossier **/(root)**.
5. Cliquer sur **Save** et attendre la fin du déploiement.
6. Accéder à l’application avec l’URL : `https://<organisation-ou-utilisateur>.github.io/TrainingSteerco/`.

Le fichier `.nojekyll` désactive le traitement Jekyll afin que les fichiers statiques soient servis tels quels.
