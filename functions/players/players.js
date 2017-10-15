var functions = require('firebase-functions');

module.exports = function (e, store) {
    e.playersIn2015 = functions.https.onRequest((request, response) => {
        response.send({
            "results" : store.collection("players")
                .where('seasons.2015', '==', true)
                .get().then(snapshot => {
                    snapshot.forEach(doc => {
                        store.collection("twentyFifteenPlayers").add(doc.data())
                    });
                })
        })
    })

    e.playersIn2014 = functions.https.onRequest((request, response) => {
        response.send({
            "results" : store.collection("players")
                .where('seasons.2014', '==', true)
                .get().then(snapshot => {
                    snapshot.forEach(doc => {
                        store.collection("twentyFourteenPlayers").add(doc.data())
                    });
                })
        })
    })

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
}