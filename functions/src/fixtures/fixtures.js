var functions = require('firebase-functions');

module.exports = function (e, store, router) {

    router.get('/', (request, response) => {
        var fixtures = []
        store.collection('fixtures').get().then(snapshot => {
            var fixture_promises = []
            snapshot.forEach(doc => {
                var original = doc.data()
                const home_promise = store.collection("teams").doc(original['home']['team']).get()
                const away_promise = store.collection("teams").doc(original['away']['team']).get()
                fixture_promises.push(Promise.all([home_promise, away_promise]).then(results => {
                    original['home']['team'] = results[0].data()
                    original['away']['team'] = results[1].data()
                    fixtures.push(original)
                }));
            });
            Promise.all(fixture_promises).then(snap => {
                response.status(200).send({
                    'fixtures' : fixtures
                })
            })
        }).catch(error => {
            response.status(500).send({
                'error': {
                    'message': 'Something went wrong gathering fixtures.'
                }
            })
        })
    });

    router.get('/:id', (request, response) => {
        store.collection('fixtures').doc(request.params.id).get()
            .then(snapshot => {
                var original = snapshot.data()
                const home_promise = store.collection("teams").doc(original['home']['team']).get()
                const away_promise = store.collection("teams").doc(original['away']['team']).get()
                const team_promises = Promise.all([home_promise, away_promise]).then(results => {
                    original['home']['team'] = results[0].data()
                    original['away']['team'] = results[1].data()
                    var fixtures = []
                    fixtures.push(original)
                    response.status(200).send({ 
                        'fixtures' : fixtures
                    })
                });
            })
            .catch(function(error) {
                response.status(404).send({ 
                    'error' : {
                        'message': 'Fixture does not exist'
                    }
                })
            });
    });

    e.fixtures = functions.https.onRequest((request, response) => {
        if (!request.path) { request.url = `/${request.url}` }
        return router(request, response)
    })

    e.buildFixtureKey = functions.firestore.document('/fixtures/{fixtureKey}').onWrite(event => {
        const original = event.data();
        var date = original['date']
        var homeTeamId = original.home['team']
        var awayTeamId = original.away['team']
        var slug = fixtureSlug(date, homeTeamId, awayTeamId);

        if (slug !== event.params.fixtureKey) {
            const home_promise = store.collection("teams").doc(original['home']['team']).get()
            const away_promise = store.collection("teams").doc(original['away']['team']).get()
            const team_promises = Promise.all([home_promise, away_promise]).then(results => {
                original['home']['team'] = results[0].data()
                original['away']['team'] = results[1].data()
                return event.data.ref.parent.child(slug).set(original).then(snap => {
                    event.data.ref.parent.child(event.params.fixtureKey).set(null)
                });
            });
        } else {
            console.log('ignoring fixture rewrite, slug already set: ' + slug)
            return;
        }
    })

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
}
