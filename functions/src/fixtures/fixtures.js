var functions = require('firebase-functions');

module.exports = function (e, store, router) {

    router.get('/', (request, response) => {
        store.collection('fixtures').get().then(snapshot => {
            var fixtures = []
            snapshot.forEach(doc => {
                fixtures.push(doc.data())
            });
            response.send({
                'fixtures' : fixtures
            })
        })
    });

    router.get('/:id', (request, response) => {
        store.collection('fixtures').doc(request.params.id).get()
            .then(snapshot => {
                var fixtures = []
                fixtures.push(snapshot.data())
                response.status(200).send({ 
                    'fixtures' : fixtures
                })
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
        console.log('fixture write: ' + event.params.fixtureKey)
        if (slug !== event.params.fixtureKey) {
            console.log('rewriting fixture with slug: ' + slug)
            event.data.ref.parent.child(event.params.fixtureKey).set(null)
            store.collection("teams").doc(homeTeamId).get().then(snapshot => {
                console.log('rewriting fixture home team: ' + snapshot.data()['name'])
                original['home']['team'] = snapshot.data()
                store.collection("teams").doc(awayTeamId).get().then(snapshot => {
                    console.log('rewriting fixture away team: ' + snapshot.data()['name'])
                    original['away']['team'] = snapshot.data()
                    console.log('returning modified fixture: ' +  + slug)
                    return event.data.ref.parent.child(slug).set(original);
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
