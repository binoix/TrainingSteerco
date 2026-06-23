# AGENTS.md — TrainingSteerco

## Objet du projet

TrainingSteerco est un MVP d’application web statique permettant de construire une stratégie SOC à partir de référentiels de sécurité : MITRE ATT&CK, PDIS ANSSI et SIM3.

L’application aide l’utilisateur à :

- sélectionner les référentiels applicables ;
- évaluer manuellement des exigences SOC ;
- renseigner la maturité actuelle, la maturité cible, la criticité, l’effort et un commentaire ;
- calculer une priorité à partir de l’écart de maturité, de la criticité et de la faisabilité ;
- générer une roadmap d’implémentation par phases ;
- exporter le contexte et la stratégie priorisée au format JSON.

Le dépôt contient une application front-end volontairement simple, sans étape de bundling, servie directement depuis des fichiers statiques.

## Structure du dépôt

- `index.html` : point d’entrée HTML de l’application.
- `src/main.js` : logique applicative, état en mémoire, données des exigences, calculs de score, rendu HTML et gestion des événements.
- `src/styles.css` : styles globaux, mise en page responsive et apparence des composants.
- `README.md` : documentation utilisateur pour démarrer, valider et publier l’application.
- `package.json` : métadonnées npm et scripts de maintenance.

## Commandes utiles

Utiliser les scripts npm existants :

```bash
npm run start
```

Démarre un serveur statique Python sur `http://localhost:5173/`.

```bash
npm run build
```

Valide la syntaxe JavaScript avec `node --check src/main.js`.

## Principes de maintenance

### Simplicité d’abord

- Conserver l’application statique tant que le besoin ne justifie pas un framework ou un bundler.
- Éviter d’ajouter des dépendances npm pour des besoins simples réalisables en JavaScript, HTML ou CSS natifs.
- Préférer des modifications lisibles et localisées à une refonte large.

### Cohérence fonctionnelle

- Garder les données métier des exigences dans `src/main.js` proches des fonctions qui les exploitent.
- Lors de l’ajout d’une exigence, fournir au minimum :
  - un `id` stable et unique ;
  - un `framework` cohérent avec les référentiels sélectionnables ;
  - un `domain` ;
  - un `title` ;
  - une `description` exploitable par un utilisateur SOC ;
  - `defaultCriticality` et `defaultEffort` sur une échelle de 1 à 5.
- Si un nouveau référentiel est ajouté, mettre à jour à la fois :
  - la liste des exigences ;
  - la sélection des référentiels par défaut ;
  - le rendu des cases à cocher ;
  - toute documentation utilisateur concernée.

### Scoring et roadmap

- Ne pas modifier les fonctions de score ou d’affectation de phase sans vérifier l’impact sur la roadmap affichée et l’export JSON.
- Les règles actuelles sont volontairement simples et explicables : écart de maturité, criticité et faisabilité.
- Toute évolution du modèle de priorité doit rester compréhensible pour un comité de pilotage ou un responsable SOC.

### Interface et accessibilité

- Maintenir une interface responsive sur mobile, tablette et desktop.
- Préserver les libellés explicites des champs et contrôles.
- Éviter les interactions qui ne fonctionnent qu’à la souris.
- Conserver une hiérarchie claire des titres et sections : contexte, référentiels, exigences, stratégie.

### Style de code

- Utiliser du JavaScript moderne sans transpilation.
- Éviter les abstractions prématurées et les helpers génériques non nécessaires.
- Garder les noms de variables et fonctions explicites.
- Ne pas entourer les imports avec des blocs `try/catch`.
- Respecter le style existant : chaînes en apostrophes simples dans JavaScript, indentation de deux espaces dans HTML, CSS et JS.

### CSS

- Réutiliser les classes existantes avant d’en créer de nouvelles.
- Préserver les breakpoints existants sauf besoin explicite.
- Éviter les styles inline dans le HTML généré par JavaScript.
- Vérifier les changements visuels sur les largeurs principales : mobile, tablette et desktop.

## Tests et vérifications avant livraison

Avant de proposer une modification, exécuter au minimum :

```bash
npm run build
```

Pour les changements d’interface ou de comportement utilisateur, démarrer aussi l’application avec :

```bash
npm run start
```

Puis vérifier manuellement dans le navigateur que :

- les référentiels peuvent être sélectionnés et désélectionnés ;
- les champs de contexte se mettent à jour ;
- les curseurs de maturité, criticité et effort recalculent les scores ;
- la roadmap reste triée par priorité ;
- l’export JSON contient les informations attendues.

## Publication GitHub Pages

L’application est compatible avec GitHub Pages sans build de production. Pour préserver cette compatibilité :

- garder `index.html` à la racine du dépôt ;
- conserver des chemins relatifs vers les assets locaux ;
- éviter les dépendances servies uniquement par un serveur applicatif ;
- ne pas introduire de routing côté client nécessitant une configuration serveur spécifique.

## Documentation

Mettre à jour `README.md` lorsque :

- une commande change ;
- une fonctionnalité utilisateur est ajoutée ou supprimée ;
- le mode de publication change ;
- les prérequis techniques évoluent.

## Gestion Git

- Faire des commits ciblés et descriptifs.
- Ne pas inclure d’artefacts générés, de logs locaux ou de fichiers temporaires.
- Vérifier `git status` avant de finaliser une intervention.
