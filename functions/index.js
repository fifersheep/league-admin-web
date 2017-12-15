// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = admin.initializeApp(functions.config().firebase);
const db = admin.database();
const store = app.firestore();
const express = require("express")

require('./src/players/players.js')(exports, store, express());
require('./src/teams/teams.js')(exports, db);
require('./src/fixtures/fixtures.js')(exports, store);
require('./src/migration/migration.js')(exports, db, store);
