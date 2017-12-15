import { request } from "http";

'use strict';

module.exports = function (e, functions, actions) {
    process.env.DEBUG = 'actions-on-google:*';
    
    const ActionsSdkApp = actions.ActionsSdkApp;
    
    const NO_INPUTS = [
      'I didn\'t hear that.',
      'If you\'re still there, say that again.',
      'We can stop here. See you soon.'
    ];

    e.sayNumber = functions.https.onRequest((request, response) => {
        const app = new ActionsSdkApp({request, response});

        function mainIntent (app) {
            console.log('mainIntent');
            let inputPrompt = app.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' +
            'I can read out an ordinal like ' +
            '<say-as interpret-as="ordinal">123</say-as>. Say a number.</speak>', NO_INPUTS);
            app.ask(inputPrompt);
        }

        function rawInput (app) {
            console.log('rawInput');
            if (app.getRawInput() === 'bye') {
            app.tell('Goodbye!');
            } else {
            let inputPrompt = app.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' +
                app.getRawInput() + '</say-as></speak>', NO_INPUTS);
            app.ask(inputPrompt);
            }
        }

        let actionMap = new Map();
        actionMap.set(app.StandardIntents.MAIN, mainIntent);
        actionMap.set(app.StandardIntents.TEXT, rawInput);

        app.handleRequest(actionMap);
    });

    e.playersAction = functions.https.onRequest((request, response) => {
        const app = new ActionsSdkApp({request, response});

        function mainIntent (app) {
            console.log('mainIntent');
            let inputPrompt = app.buildInputPrompt(true, '<speak>Hey! <break time="1"/> ' +
            'I can help you find a Wolves player name, just tell me their jersey number.</speak>', NO_INPUTS);
            app.ask(inputPrompt);
        }

        function rawInput (app) {
            console.log('rawInput');
            if (app.getRawInput() === 'bye') {
                app.tell('Goodbye!');
            } else {
            let inputPrompt = app.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' +
                app.getRawInput() + '</say-as></speak>', NO_INPUTS);
                app.ask(inputPrompt);
            }
        }

        let actionMap = new Map();
        actionMap.set(app.StandardIntents.MAIN, mainIntent);
        actionMap.set(app.StandardIntents.TEXT, rawInput);

        app.handleRequest(actionMap);
    });
}