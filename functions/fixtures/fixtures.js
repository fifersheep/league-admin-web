var functions = require('firebase-functions');

module.exports = function (e) {
    e.buildFixtureKey = functions.database.ref('/fixtures/{fixtureKey}')
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
