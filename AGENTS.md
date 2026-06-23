# AGENTS.md — TrainingSteerco

## Objet du projet

TrainingSteerco est un MVP d’application web statique permettant de cartographier la couverture de détection d’un SOC sur la matrice MITRE ATT&CK, pondérée par un scénario de menace.

L’application aide l’utilisateur à :

- choisir un scénario de menace prioritaire (ransomware, BEC, APT, menace interne) ;
- visualiser, via une heatmap, le statut de couverture de chaque technique ATT&CK (aveugle / partielle / couverte) ;
- faire évoluer ce statut par simple clic ;
- obtenir un plan d’action priorisé selon la pertinence de la technique pour le scénario × l’écart de couverture ;
- obtenir une synthèse textuelle exploitable en comité de pilotage ;
- exporter le contexte, le scénario et le plan d’action au format JSON.

Le dépôt contient une application front-end volontairement simple, sans étape de bundling, servie directement depuis des fichiers statiques.

## Structure du dépôt

- `index.html` : point d’entrée HTML de l’application.
- `src/main.js` : logique applicative, état en mémoire, données des techniques ATT&CK, calculs de score, rendu HTML et gestion des événements.
- `src/styles.css` : styles globaux, mise en page responsive et apparence des composants.
- `README.md` : documentation utilisateur pour démarrer, valider et publier l’application.

Le projet n’a aucune dépendance npm : pas de `package.json`, pas d’étape d’installation.

## Commandes utiles

```bash
python3 -m http.server 5173
```

Démarre un serveur statique sur `http://localhost:5173/`.

```bash
node --check src/main.js
```

Valide la syntaxe JavaScript.

## Principes de maintenance

### Simplicité d’abord

- Conserver l’application statique tant que le besoin ne justifie pas un framework ou un bundler.
- Éviter d’ajouter des dépendances npm pour des besoins simples réalisables en JavaScript, HTML ou CSS natifs.
- Préférer des modifications lisibles et localisées à une refonte large.

### Cohérence fonctionnelle

- Garder les données métier des techniques ATT&CK dans `src/main.js` proches des fonctions qui les exploitent.
- Lors de l’ajout d’une technique, fournir au minimum :
  - un `id` stable correspondant à l’identifiant ATT&CK officiel (ex. `T1566`) ;
  - une `tactic` cohérente avec les colonnes de la heatmap ;
  - un `name` fidèle au nom ATT&CK ;
  - des `dataSources` réalistes (sources de log permettant de détecter la technique) ;
  - un `weight` par scénario de menace (`ransomware`, `bec`, `apt`, `insider`), sur une échelle de 1 à 5.
- Si un nouveau scénario de menace est ajouté, mettre à jour à la fois :
  - `threatProfiles` ;
  - le `weight` de chaque technique pour ce scénario ;
  - le rendu des cartes de sélection de scénario ;
  - toute documentation utilisateur concernée.

### Scoring et plan d’action

- Ne pas modifier les fonctions de score (`priorityScore`, `weightedCoveragePct`) sans vérifier l’impact sur la heatmap, le plan d’action et l’export JSON.
- Les règles actuelles sont volontairement simples et explicables : pertinence de la technique pour le scénario sélectionné × écart de couverture.
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
node --check src/main.js
```

Pour les changements d’interface ou de comportement utilisateur, démarrer aussi l’application avec :

```bash
python3 -m http.server 5173
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
