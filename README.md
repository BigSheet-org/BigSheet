# BigSheet

Tableur Client-Serveur du projet pour l'UE Design Patterns.

## Description

Le projet BigSheet est une application web qui permet aux utilisateurs de créer, éditer, partager et sauvegarder des documents similaires à Excel. L'application est basée sur une architecture client-serveur qui offre des fonctionnalités avancées pour la gestion de données en temps réel, la collaboration et la persistance des données.
Fonctionnalités

- Création d’un compte: Les utilisateurs peuvent créer un compte pour accéder à l'application.
- Connexion: Les utilisateurs enregistrés peuvent se connecter à leur compte.
- Création d’un document vide: Les utilisateurs peuvent créer de nouveaux documents vides pour commencer à travailler.
- Ouverture d’un document sauvegardé: Les utilisateurs peuvent ouvrir des documents précédemment sauvegardés.
- Modification d’un document: Les utilisateurs peuvent éditer et mettre à jour les données de leurs documents.
- Sauvegarde d’un document: Les modifications apportées aux documents peuvent être sauvegardées.
- Suppression d’un document: Les utilisateurs peuvent supprimer des documents inutiles.
- Persistance des données: Les données des documents sont sauvegardées de manière persistante pour garantir la récupération en cas de perte de connexion.
- Partage d’un document sauvegardé: Les utilisateurs peuvent partager leurs documents avec d'autres utilisateurs en fournissant des autorisations d'accès.
- Affichage des utilisateurs travaillant simultanément sur le même document: Les utilisateurs peuvent voir qui travaille sur un document partagé en temps réel.
- Mise à jour en temps réel de l’affichage: Les modifications apportées par d'autres utilisateurs sont instantanément reflétées dans l'affichage du document, garantissant une collaboration efficace.

## Prérequis
```
Node.js - Version 18.18.2
Docker-compose - Version 2.15.1
```

## Installation
Clonez ce référentiel.

```bash
git clone https://github.com/BigSheet-org/BigSheet.git
```

### Frontend

Installez les dépendances :
```bash
cd frontend
npm install
```

Lancez l'application :

```bash
npm run dev
```

### Backend

Installez les dépendances :
```bash
cd backend
npm install
```

Créez les fichiers de configurations du projet :

- Sous Windows : (Il faut avoir autorisé l'exécution de scripts powershell auparavant. Si ce n'est pas le cas, les instructions nécessaires pour cette action sont disponibles sur le lien suivant : https://www.windows8facile.fr/powershell-execution-de-scripts-est-desactivee-activer/)
```bash
npm run config_win
```

- Sous Unix (Linux ou Mac) :
```bash
npm run config_unix
```

Lancez les containers Docker : 

- En cas de développement sur le serveur Node : 
```bash
docker-compose -f docker-compose_backdev.yml up -d
```

- En cas de développement sur l'application VueJS : 
```bash
docker-compose up -d
```

Si vous développez l'application backend, vous pouvez lancer le serveur Node avec les commandes suivantes : 
```bash
cd backend
node .
```

## Contribution

Quatre développeurs contribuent au projet actuellement : 

| Nom :           | MARCELIN Maxime                                   | JOLY Clément                                     | QUEIGNEC Nicolas                                 | BORGONDO David                                     |
| --------------- | ------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ |
| Profil GitHub : | [@Maximelego](https://github.com/Maximelego)      | [@aildontknow](https://github.com/@aildontknow)  | [@Fulash](https://github.com/QUEIGNEC) |   [@DB-Sirius](https://github.com/DB-Sirius) | 