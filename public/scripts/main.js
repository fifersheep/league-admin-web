'use strict';

function PlayerDetails() {

    // Shortcuts to DOM Elements.
    this.playerFirstname = document.getElementById('firstname');
    this.playerLastname = document.getElementById('lastname');
    this.playerMiddlenames = document.getElementById('middlenames');
    this.playerBirthplace = document.getElementById('birthplace');
    this.playerAge = document.getElementById('age');
    this.playerHeight = document.getElementById('height');
    this.playerWeight = document.getElementById('weight');
    this.playerNumber = document.getElementById('player-number');
    this.playerPosition = document.getElementById('position');
    this.playerTeam = document.getElementById('team');
    this.playerSeasons = document.getElementById('seasons');
    this.submitPlayerButton = document.getElementById('submit-player');
    this.submitPlayerForm = document.getElementById('addPlayerForm');

    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    this.submitPlayerForm.addEventListener('submit', this.submitPlayer.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.playerFirstname.addEventListener('keyup', buttonTogglingHandler);
    this.playerFirstname.addEventListener('change', buttonTogglingHandler);
    this.playerLastname.addEventListener('keyup', buttonTogglingHandler);
    this.playerLastname.addEventListener('change', buttonTogglingHandler);
    this.playerAge.addEventListener('keyup', buttonTogglingHandler);
    this.playerAge.addEventListener('change', buttonTogglingHandler);
    this.playerHeight.addEventListener('keyup', buttonTogglingHandler);
    this.playerHeight.addEventListener('change', buttonTogglingHandler);
    this.playerWeight.addEventListener('keyup', buttonTogglingHandler);
    this.playerWeight.addEventListener('change', buttonTogglingHandler);

    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
PlayerDetails.prototype.initFirebase = function() {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

PlayerDetails.prototype.hasFilledNecessaryFields = function () {
    return !!(this.playerFirstname.value && this.playerLastname.value && this.playerAge.value && this.playerHeight.value && this.playerWeight.value);
};

// Enables or disables the submit button depending on the values of the input
// fields.
PlayerDetails.prototype.toggleButton = function() {
    if (this.hasFilledNecessaryFields()) {
        this.submitPlayerButton.removeAttribute('disabled');
    } else {
        this.submitPlayerButton.setAttribute('disabled', 'true');
    }
};

// Saves a new message on the Firebase DB.
PlayerDetails.prototype.submitPlayer = function(e) {
    e.preventDefault();
    var showPermissionDenied = function () {
        this.displayToast('Please log in as an administrator to create players');
    };

    // Check that the user entered a message and is signed in.
    if (this.hasFilledNecessaryFields() && this.checkSignedIn()) {
        // Add a new message entry to the Firebase Database.
        this.playersRef.push({
            firstname: this.playerFirstname.value,
            lastname: this.playerLastname.value,
            middlenames: this.playerMiddlenames.value,
            birthplace: this.playerBirthplace.value,
            age: this.playerAge.value,
            height: this.playerHeight.value,
            weight: this.playerWeight.value,
            number: this.playerNumber.value,
            position: this.playerPosition.value,
            team: this.playerTeam.value,
            seasons: this.playerSeasons.value
        }).then(function() {
            // Display toast
            this.displayToast('Player created');
        }.bind(this)).catch(function(error) {
            if (error.code === "PERMISSION_DENIED") {
                playerDetails.signInSnackbar.MaterialSnackbar.showSnackbar({
                    message: 'Permission denied',
                    timeout: 2000
                });
            }
            console.error('Error writing new player to Firebase Database', error);
        });
    }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
PlayerDetails.prototype.displayToast = function(m) {
    // Display a message to the user using a Toast.
    var data = {
        message: m,
        timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
};

// Returns true if user is signed-in. Otherwise false and displays a message.
PlayerDetails.prototype.checkSignedIn = function() {
    // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
        return true;
    }

    // Display a message to the user using a Toast.
    this.displayToast('You must sign-in first');
    return false;
};

// Signs-in Friendly Chat.
PlayerDetails.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
PlayerDetails.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
PlayerDetails.prototype.onAuthStateChanged = function(user) {
    if (user) { // User is signed in!
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;
        var userName = user.displayName;

        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');

        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');

        // We load currently existing chant messages.
        // this.loadMessages();
        this.playersRef = this.database.ref('players');

        // We save the Firebase Messaging Device token and enable notifications.
        // this.saveMessagingDeviceToken();
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
    }
};

// Checks that the Firebase SDK has been correctly setup and configured.
PlayerDetails.prototype.checkSetup = function() {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
        window.alert('Your Cloud Storage bucket has not been enabled. Sorry about that. This is ' +
            'actually a Firebase bug that occurs rarely. ' +
            'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
            'and make sure the storageBucket attribute is not empty. ' +
            'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
            'displayed there.');
    }
};
