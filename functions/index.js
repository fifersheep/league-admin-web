// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = admin.initializeApp(functions.config().firebase);
const db = admin.database();
const store = app.firestore();
const actions = require('actions-on-google');

require('./src/players/players.js')(exports, store);
require('./src/players/players-actions.js')(exports, functions, actions);
require('./src/teams/teams.js')(exports, db);
require('./src/fixtures/fixtures.js')(exports, store);
require('./src/migration/migration.js')(exports, db, store);
