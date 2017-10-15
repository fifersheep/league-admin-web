'use strict';

function ReadPlayers() {
    this.playerList = document.getElementById('players');
    this.database = firebase.database();
    this.loadPlayers();
}

ReadPlayers.PLAYER_TEMPLATE =
    '<div class="player-container">' +
        '<div class="firstname"></div>' +
        '<div class="lastname"></div>' +
    '</div>';

ReadPlayers.prototype.displayPlayer = function (key, firstname, lastname) {
    var div = document.getElementById(key);
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = ReadPlayers.PLAYER_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.playerList.appendChild(div);
    }
    div.querySelector('.firstname').textContent = firstname;
    div.querySelector('.lastname').textContent = lastname;
    // Show the card fading-in.
    setTimeout(function() {div.classList.add('visible')}, 1);
    this.playerList.scrollTop = this.playerList.scrollHeight;
};

ReadPlayers.prototype.loadPlayers = function() {
    this.playersRef = this.database.ref('players');
    this.playersRef.off();

    var populatePlayerData = function(data) {
        var val = data.val();
        this.displayPlayer(data.key, val.firstname, val.lastname);
    }.bind(this);
    this.playersRef.on('child_added', populatePlayerData);
    this.playersRef.on('child_changed', populatePlayerData);
    this.playersRef.on('child_removed', function (data) {
        var div = document.getElementById(data.key);
        div.remove();
        console.log('Player ' + data.key +' was removed');
    });
};