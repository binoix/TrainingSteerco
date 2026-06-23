# TrainingSteerco

MVP d’application web interactive pour cartographier la couverture de détection SOC sur la matrice MITRE ATT&CK, pondérée par un scénario de menace prioritaire.

## Fonctionnalités

- Sélection d’un scénario de menace prioritaire (ransomware, compromission de compte/BEC, espionnage/APT, menace interne) qui pondère la pertinence de chaque technique.
- Heatmap interactive d’un sous-ensemble représentatif des tactiques et techniques ATT&CK Enterprise, avec statut de couverture cliquable (aveugle / partielle / couverte).
- Calcul d’une couverture globale pondérée par la pertinence des techniques pour le scénario sélectionné.
- Plan d’action priorisé : techniques à traiter en premier, avec les sources de log à mobiliser pour combler l’écart.
- Synthèse textuelle orientée comité de pilotage : couverture globale, angles morts critiques, sources de log à instrumenter.
- Export JSON du contexte, du scénario et du plan d’action.

## Démarrage

L’application n’a aucune dépendance et ne nécessite aucune installation. Servez le dossier avec n’importe quel serveur statique, par exemple :

```bash
python3 -m http.server 5173
```

L’application est ensuite disponible sur http://localhost:5173/.

## Validation

Le projet ne comporte pas d’étape de build. Pour vérifier la syntaxe JavaScript avant de livrer :

```bash
node --check src/main.js
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
