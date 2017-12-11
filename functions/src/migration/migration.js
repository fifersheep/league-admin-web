var functions = require('firebase-functions');

module.exports = function (e, db, store) {
    e.migrateFixtures = functions.https.onRequest((request, response) => {
        db.ref('fixtures').once('value').then(function(snapshot) {
            snapshot.forEach(function(child) {
                var original = child.val()
                var date = original['date']
                var homeTeam = original.home['team']
                var awayTeam = original.away['team']
                var slug = fixtureSlug(date, homeTeam, awayTeam);
    
                store.collection("fixtures").doc(slug).set(original)
            });
        });
        response.send({"success": true})
    })

    e.migratePlayers = functions.https.onRequest((request, response) => {
        var values = {}
        db.ref('players').once('value').then(function(snapshot) {
            snapshot.forEach(function(child) {
                child.ref.update({"team": "edi-wolves-seniors"})
            });
            response.send(test)
        });
    })

    e.storePlayers = functions.https.onRequest((request, response) => {
        db.ref('players').once('value').then(function(snapshot) {
            snapshot.forEach(function(child) {
                store.collection("players").add(child.val())
            });
        });
        response.send({"success": true})
    })

    e.storeConferences = functions.https.onRequest((request, response) => {
        db.ref('conferences').once('value').then(function(snapshot) {
            snapshot.forEach(function(child) {
                store.collection("conferences").add(child.val())
            });
        });
        response.send({"success": true})
    })

    e.storeTeams = functions.https.onRequest((request, response) => {
        db.ref('teams').once('value').then(function(snapshot) {
            snapshot.forEach(function(child) {
                store.collection("teams").doc(child.key).set(child.val())
            });
        });
        response.send({"success": true})
    })
}

function fixtureSlug(date, homeTeam, awayTeam) {
    var day = date.substring(0, 2);
    var month = date.substring(3, 5);
    var year = date.substring(8, 10);
    return year + month + day + "-" + homeTeam + "-" + awayTeam;
}
