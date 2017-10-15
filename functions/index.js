// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = admin.initializeApp(functions.config().firebase);
const db = admin.database();
const store = app.firestore();

require('./players/players.js')(exports, store);
require('./teams/teams.js')(exports, db);
require('./fixtures/fixtures.js')(exports);
require('./migration/migration.js')(exports, db);
