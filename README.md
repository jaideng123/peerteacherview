# Newpeerteacherview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

This project contains the front-end and back-end for the peer-teacher display in HRBB

## Back-End
The Back-End is written in NodeJS using Express, it is mainly responsible for getting the peer teacher data from Parsehub and caching it so that it can be served to the front-end
It also serves the files for the front-end
All the code is contained in server.js
the keys for parsehub are pulled in as environment variables or from a file called keys.js that you can create

## Front-End
The Front-End is written in Angular 6 and Typescript and is responsible for formatting the peer teacher data and displaying the active peer teachers.
It is set to hard refresh every 30 minutes or so to accomodate any changes made
All the code for the front-end is in the src folder

## Running the project locally
Make sure you have install [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm)
1. Clone the repo to your local machine
2. run `npm install`
3. run `npm run dev`
After that a browser should open up with the app running and will automatically refresh when you make changes to the codebase (except for server.js)

## Heroku
The Project is hosted on platform called [Heroku](https://www.heroku.com/)
Dr Leyk has the credentials for this and you should contact her to 
All commits to this repository will automatically be built and deployed to [http://ptview.herokuapp.com/](http://ptview.herokuapp.com/)
The heroku console contains the the keys for parsehub in the config vars setting
Heroku will also trigger a daily run of update.js which will trigger a new parsehub crawl
