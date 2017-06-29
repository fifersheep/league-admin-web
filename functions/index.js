// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database;

exports.helloWorld = functions.https.onRequest((request, response) => {
    var test = {}
    admin.database().ref('test').once('value').then(function(snapshot) {
        snapshot.forEach(function(child) {
            child.ref.update({"name": "Boom!"})
        });
        response.send(test)
    });
});

exports.migratePlayers = functions.https.onRequest((request, response) => {
    var values = {}
    admin.database().ref('players').once('value').then(function(snapshot) {
        snapshot.forEach(function(child) {
            child.ref.update({"team": "edi-wolves-seniors"})
        });
        response.send(test)
    });
});

exports.buildFixtureKey = functions.database.ref('/fixtures/{fixtureKey}')
    .onWrite(event => {
        if (!event.data.exists()) { return; }

        const original = event.data.val();
        var date = original['date']
        var homeTeam = original.home['team']
        var awayTeam = original.away['team']
        var slug = fixtureSlug(date, homeTeam, awayTeam);
        if (slug !== event.params.fixtureKey) {
            console.log('rewriting fixture with slug: ' + slug)
            event.data.ref.parent.child(event.params.fixtureKey).set(null)
            return event.data.ref.parent.child(slug).set(original);
        } else {
            console.log('ignoring fixture rewrite, slug already set: ' + slug)
            return;
        }
    });

function createTeam(slug, name, location, conference, stadium, players) {
    db.ref("teams").child(slug).set({
        name: name,
        location: location,
        conference: conference,
        stadium: stadium,
        players: players
    });
}

function createPlayer(firstname, lastname, middlenames, birthplace, age, height, weight, team, number, position, seasons) {
    db.ref("players").push({
        firstname: firstname,
        lastname: lastname,
        middlenames: middlenames,
        birthplace: birthplace,
        age: age,
        height: height,
        weight: weight,
        number: number,
        position: position,
        team: team,
        seasons: seasons
    })
}

function fixtureSlug(date, homeTeam, awayTeam) {
    var day = date.substring(0, 2);
    var month = date.substring(3, 5);
    var year = date.substring(8, 10);
    return year + month + day + "-" + homeTeam + "-" + awayTeam;
}

function createFixture(conference, date, week, status,
                       homeTeam, homeScore, awayTeam, awayScore) {
    db.ref('fixtures').child(fixtureSlug()).set({
        conference: conference,
        date: date,
        week: week,
        status: status,
        home: {
            team: homeTeam,
            score: homeScore
        },
        away: {
            team: awayTeam,
            score: awayScore
        }
    })
}

function refDictFromList(list) {
    var dict = {};
    list.forEach(function (item) {
        dict[item] = true;
    });
    return dict
}
