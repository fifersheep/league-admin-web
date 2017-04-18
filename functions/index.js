// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database;

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

function docRefs(list) {
    var dict = {};
    list.forEach(function (item) {
        dict[item] = true;
    });
    return dict
}
