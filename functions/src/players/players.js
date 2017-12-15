var functions = require('firebase-functions');

module.exports = function (e, store, router) {

    router.get('/', (request, response) => {
        store.collection("players").get().then(snapshot => {
            var players = []
            snapshot.forEach(doc => {
                players.push(doc.data())
            });
            response.send({
                "players" : players
            })
        })
    });

    router.get('/:id', (request, response) => {
        store.collection("players").doc(request.params.id).get()
            .then(snapshot => {
                var players = []
                players.push(snapshot.data())
                response.status(200).send({ 
                    "players" : players
                })
            })
            .catch(function(error) {
                response.status(404).send({ 
                    "error" : {
                        "message": "Player does not exist"
                    }
                })
            });
    });

    e.players = functions.https.onRequest((request, response) => {
        if (!request.path) { request.url = `/${request.url}` }
        return router(request, response)
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