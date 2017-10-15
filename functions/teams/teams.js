var functions = require('firebase-functions');

module.exports = function (e, db) {
    function createTeam(slug, name, location, conference, stadium, players) {
        db.ref("teams").child(slug).set({
            name: name,
            location: location,
            conference: conference,
            stadium: stadium,
            players: players
        });
    }
}
