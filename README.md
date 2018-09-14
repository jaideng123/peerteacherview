# Newpeerteacherview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

This project contains the front-end and back-end for the peer-teacher display in HRBB

## Back-End
The Back-End is written in NodeJS using Express, it is mainly responsible for getting the peer teacher data from Parsehub and caching it so that it can be served to the front-end
It also serves the files for the front-end
All the code is contained in server.js

## Front-End
The Front-End is written in Angular 6 and Typescript and is responsible for formatting the peer teacher data and displaying the active peer teachers. All the code is in the src folder

## Running the project locally
Make sure you have install [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm)
1. Clone the repo to your local machine
2. run `npm install`
3. run `npm run dev`
After that a browser should open up with the app running and will automatically refresh when you make changes to the codebase (except for server.js)
