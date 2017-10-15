var functions = require('firebase-functions');

module.exports = function (e, store) {

    e.playersInYear = functions.https.onRequest((request, response) => {
        var year = request.body.year
        store.collection("players")
            .where("seasons." + year, '==', true)
            .get().then(snapshot => {
                var players = []
                snapshot.forEach(doc => {
                    store.collection("playersFrom" + year).add(doc.data())
                    players.push(doc.data())
                });
                response.send({ 
                    "year" : year,
                    "players" : players
                })
            })
    })

    function createPlayer(firstname, lastname, middlenames, birthplace, age, height, weight, team, number, position, seasons) {
        store.collection("players").add({
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