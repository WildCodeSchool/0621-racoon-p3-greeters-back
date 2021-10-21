## loirevalleygreeters.com / partie back

Une base de données utilisée pour filtrer et afficher les données de greeters, les infos sur les villes et sur l'esprit greeter, construite avec MySql, Express.

## Status du projet

Ce projet est actuellement en développement. 

## Instructions d'installation et de configuration

Clonez ce repository. Vous aurez besoin de `node` et `npm` installés globalement sur votre machine.

Installation:

après avoir installer la base de données Sql sur votre machine grâce au fichier .sql 

`npm install`  

Pour démarrer le serveur :

Créez un fichier .env sur la base du fichier .env.sample exemple : PORT= ? DB_HOST= ? DB_PORT= ? DB_USER= ? DB_PASSWORD= ? DB_NAME= 

`npm start`  

Pour accéder à la route du back :

Mettre le lien du port ouvert par le back

exemple :

`localhost:5000/`

## Réflexion

Il s'agissait d'un projet de 7 semaines construit au cours de notre formation de développeur web à la Wild Code School. Les objectifs du projet comprenaient l'utilisation des technologies apprises jusqu'à présent.

À l'origine, nous devions refaire un site existant (Drupal) permettant aux utilisateurs de réserver une balade avec un greeter. Nous avons créé une base de données avec MySql, puis un back avec NodeJs et Express.

L'un des principaux défis que nous avons rencontrés était la communication entre le back-end et le front-end.

En fin de compte, les technologies mises en œuvre dans ce back sont express, mysql2, morgan, jsonwebtoken, joi, dotenv, cors, cookie-parser, argon2.
