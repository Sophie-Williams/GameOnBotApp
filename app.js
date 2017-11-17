/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
var builder = require("botbuilder");
var restify = require('restify');
var path = require('path');
var https = require('https');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

https.get('https://sam.gameontechnology.com/v1/competitions/bdde04a5-14b6-414e-866f-69a39db52ebe/teams', (resp) => {
    let data = '';
   
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
   
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data).data);
    });
   
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

var connector = new builder.ChatConnector({
    appId: '7a7bdde0-5844-41a9-91c7-68224a445055',
    appPassword: 'qgmV43-gcdcQRHYVN372<-|'
});

server.post('/', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to Team Fight.");
        session.beginDialog('askForTeam1');
    },
    function (session, results) {
        session.dialogData.team1 = results.response;
        session.beginDialog('askForTeam2');
    },
    function (session, results) {
        session.dialogData.team2 = results.response;

        // now compare team, set global variable
        var winner = session.dialogData.team1;
        session.send(`Between ${session.dialogData.team1} and ${session.dialogData.team2} <br/> ${winner} is better.`);
        session.endDialog();
    },
    function (session, results) {
        session.dialogData.team1 = results.response;
        session.beginDialog('moreDetails');
    },
]);

bot.dialog('askForTeam1', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Sorry, I can't find this team. Please choose team 1 again")
        } else {
            builder.Prompts.text(session, "Please choose team 1.");
        }
    },
    function (session, results) {
        if(results.response == "Seattle")
        {
            // session.userData.team1 = results.team1;
            session.endDialogWithResult(results);
        }
        else 
        {
            session.replaceDialog('askForTeam1', { reprompt: true });
        }
    }
]);

bot.dialog('askForTeam2', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Sorry, I can't find this team. Please choose team 2 again")
        } else {
            builder.Prompts.text(session, "Please choose team 2.");
        }
    },
    function (session, results) {
        // check if team is in the api call

        if(results.response == "Seattle")
        {
            // session.userData.team1 = results.team1;
            session.endDialogWithResult(results);
        }
        else 
        {
            session.replaceDialog('askForTeam2', { reprompt: true });
        }
    }
]);
