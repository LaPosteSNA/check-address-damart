# JQuery Serca-form [![Travis statut](https://travis-ci.org/LaPosteSNA/serca-form.svg?branch=master)](https://travis-ci.org/LaPosteSNA/serca-form) [![Coverage Status](https://coveralls.io/repos/github/LaPosteSNA/serca-form/badge.svg?branch=master)](https://coveralls.io/github/LaPosteSNA/serca-form?branch=master)

Un plugin jQuery pour mettre un formulaire sur votre site qui appel le service web SERCA.

## Utilisation 

### Intégration du code

1 - Inclure les styles css de bootstrap

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
```

2 - Inclure le style css de notre plugin

```html
<link rel="stylesheet" href="dist/css/jquery.serca-form.min.css" />
```

3 - Insérer la balise div dans laquelle le formulaire va être intégré:

```html
<div id="serca-form"></div>
```

4 - Inclure les librairies jQuery et Bootstrap:

```html
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
```

5 - Inclure le code javascript du plugin :

```html
<script src="dist/js/jquery.serca-form.min.js"></script>
```

6 - Appeler le plugin avec le paramétrage souhaité:

```javascript
<script type="application/javascript">
    $(document).ready(function() {
        $("#serca-form").sercaForm({
            propertyName: "a custom value"
        });
    });
</script>
```

### Paramétrage

```javascript
$("#serca-form").sercaForm({
    backColor: '', // Couleur de fond du formulaire
    title: '', // Titre du formulaire
    autocompleteListStyle: '', // Permet d'ajouter une classe css spécifique à la liste des résultats retournés
    ihmModelAndVersion: 'bootstrap4', // Modele et version d'ihm à utiliser (bootstrap4, bootstrap3,...) 
    login: 'ihm_services_adresses', // Login du service serca
    password: 'SAi0DFgoJf', // Mot de passe du service serca
    corpsProxy: "", // Url du proxy cors si nécessaire
    distantDNS: "https://www.serca.preprod.laposte.fr", // Nom de domaine du service serca
    maxRetries: 3, // Nombre de tentative de rejeu en cas d'erreur du service distant
    minDelayBeforeCall: 50, // Délai en millisecondes entre de frappes claiver avant d'appeler la recherche distante
    minLengthBeforeCall: 3, // Nombre de caractères minimal saisi avant recherche distante
    autocompletion: {
        row3: false, // Réalise une autocompletion en prenant en compte la ligne3 dans le référentiel d'adresses
        row4_number: true, // Réalise une autocompletion en prenant en compte le numéro dans la voie dans le référentiel  d'adresses
        row4_road: true, // Réalise une autocompletion en prenant en compte la voie dans le référentiel d'adresses
        postal_code_locality: true, // Réalise une autocompletion en prenant en compte le code postal localité dans le référentiel d'adresses
        cedex_id: true // Réalise une autocompletion en prenant en compte le cedex dans le référentiel d'adresses
    },
    continueOnError: true, // Le formulaire peut-être validé même en cas d'erreur
    nbDisplayedResults: 5, // Nombre de résultats affiché dans les propositions
    language: 'fr', // Langage des messages d'erreur
    lockFormAddressRow6: true, // Bloque la saisie des autres champs si le champ d'adresse 6 n'est pas valide
    displayAddressLabel: false // Affiche l'adresse complete validée en dessous du formulaire
});
```

## Développement du plugin

### Configuration du poste de développement

0 - Prérequis:

    Avoir installé node.js, git, git-bash, npm

1 - Récupérer le projet:

    Lancer le programme git-bash puis

    git clone https://github.com/LaPosteSNA/serca-form.git

2 - Aller dans le projet:

    cd serca-form

3 - Installer le projet:

    npm install

4 - Configurer git pour installer des hooks:

    cp ./bin/git-pre-commit.sh .git/hooks/pre-commit

### Structure

La structure du projet est définie comme suit:

```
├── index.html
├── bin/
|   └── scripts bash
├── coverage/
├── dist/
│   │── js/
│   │   ├── jquery.serca-form.{VERSION}.min.js
│   │   └── jquery.serca-form.{VERSION}.min.js.map
│   │   ├── jquery.serca-form.min.js
│   │   └── jquery.serca-form.min.js.map
│   └── css/
│       ├── jquery.serca-form.{VERSION}.min.css
│       └── jquery.serca-form.min.css
├── src/
│   │── js/
│   │   └── jquery.serca-form.js
│   └── css/
│       └── jquery.serca-form.css
├── test/
│   │── spec/
│   │   └── jquery.serca-form.spec.js
|   └── setup.js
├── vendor/
|   └── *.js, *.css
├── .gitignore
├── .jshintrc
├── .eslintrc.js
├── .travis.yml
├── Gruntfile.js
├── karma.conf.js
└── package.json
```

#### [index.html](https://github.com/laposteSNA/serca-form/tree/master/)

Fichier de démonstration du projet

#### [bin/](https://github.com/LaPosteSNA/serca-form/tree/master/bin)

Scripts shell lancé pour les pre-commit git

#### [coverage/](https://github.com/LaPosteSNA/serca-form/tree/master/coverage)

Résultats des couvertures de test

#### [dist/](https://github.com/LaPosteSNA/serca-form/tree/master/dist)

Fichiers compilés, minifiés,versionnés par grunt et pouvant être utilisés

#### [src/](https://github.com/LaPosteSNA/serca-form/tree/master/src)

Fichiers sources propre au projet

#### [test/](https://github.com/LaPosteSNA/serca-form/tree/master/test)

Fichiers de test unitaire

#### [vendor/](https://github.com/LaPosteSNA/serca-form/tree/master/vendor)

Librairies externes (js, css)

#### [.gitignore](https://github.com/LaPosteSNA/serca-form/tree/master/.gitignore)

Liste de fichier ignorés par git

> Voir [Git Ignoring Files Guide](https://help.github.com/articles/ignoring-files) pour plus de détail.

#### [.jshintrc](https://github.com/LaPosteSNA/serca-form/tree/master/.jshintrc)

Liste de règles utilisées par JSHint pour détetcter des problèmes potentiels dans javascript

> Voir [jshint.com](http://jshint.com/about/) pour plus de détail.

#### [.eslintrc.js](https://github.com/LaPosteSNA/serca-form/tree/master/.eslintrc.js)

Liste de règles utilisées par ESlint pour détetcter des problèmes potentiels dans javascript

> Voir [eslint.org](https://eslint.org/docs/about/) pour plus de détail.

#### [.travis.yml](https://github.com/LaPosteSNA/serca-form/tree/master/.travis.yml)

Configuration de l'intégration continue travis et le déploiement automatique des versions validées.

> Voir [travis-ci.org](http://about.travis-ci.org/) pour plus de détail.

#### [Gruntfile.js](https://github.com/LaPosteSNA/serca-form/tree/master/Gruntfile.js)

Liste de toute les tâches automatisées du projet (minification, validation, tests unitaires,..)

> Voir [gruntjs.com](http://gruntjs.com) pour plus de détail.

#### [karma.conf.js](https://github.com/LaPosteSNA/serca-form/tree/master/karma.conf.js)

Configuration de karma pour lancer les test unitaires

> Voir [karma-runner.github.io](http://karma-runner.github.io/1.0/index.html) pour plus de détail.

#### [package.json](https://github.com/LaPosteSNA/serca-form/tree/master/package.json)

Spécification des dépendances node.js et paramétrage du projet

> Voir [NPM](https://npmjs.org/doc/json.html) pour plus de détail..

### Lancer le serveur

    npm start

### Opérations de développement

#### Lancer une suite (lint, test, minification js et css)

    npm run build

#### Lancer les tests lint (validation du code javascript)

    npm run lint

#### Lancer les tests unitaires

    npm test ou npm run test

#### Afficher la couverture de test

    npm run view-coverage puis ouvrir le navigateur

### Déployer une nouvelle version

Le déploiement est réalisé automatiquement sur github sur la branche gh-pages par travis lors d'un git push si les tests passent.

### Trucs et astuces

Faciliter le debug de jquery ui en commentant le display:none
.ui-helper-hidden-accessible {
    display: none;
}

### Recette fonctionelle

1 - Prérequis : installer l'extension selenium IDE dans firefox

2 - Lancer selenium IDE depuis firefox

3 - Dans selenium, importer le [test](https://github.com/LaPosteSNA/serca-form/tree/master/test/selenium/)

4 - Lancer le test depuis selenium IDE
