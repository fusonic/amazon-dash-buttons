// require modules needed to send Slack messages
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { WebClient } = require('@slack/client');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'credentials.json';

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        magic(sender, providerConfig);
    }
};

function magic(sender, providerConfig) {
// Load client secrets from a local file.
    try {
        const content = fs.readFileSync('/opt/dash-button/scripts/providers/client_secret.json');
        authorize(JSON.parse(content), listEvents, sender, providerConfig);
    } catch (err) {
        return console.log('Error loading client secret file:', err);
    }

}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials, callback, sender, providerConfig) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    let token = {};
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
        token = fs.readFileSync(TOKEN_PATH);
    } catch (err) {
        return getAccessToken(oAuth2Client, callback, sender, providerConfig);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, sender, providerConfig);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, sender, providerConfig) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            try {
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                console.log('Token stored to', TOKEN_PATH);
            } catch (err) {
                console.error(err);
            }
            callback(oAuth2Client, sender, providerConfig);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, sender, providerConfig) {
    const calendar = google.calendar({version: 'v3', auth});
    var startTime = new Date();
    var time = sender.providerConfig.time;

    if (time == 'now') {
        startTime = (new Date()).toISOString();
    } else {
        time = startTime.getTime() + time * 60000;
        startTime = (new Date(time)).toISOString();
    }

    calendar.events.list({
        calendarId: sender.providerConfig.calendarId,
        timeMin: startTime,
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        let emails = {};

        events[0].attendees.forEach(value => {
            if (value.email == 'rene.zumtobel@fusonic.net') {
                emails[value.email] = value.email;
            }
        });
        sendSlackReminder(emails, events[0], sender, providerConfig);
    });
}

function sendSlackReminder(emails, appointment, sender, providerConfig) {
    const web = new WebClient(providerConfig.slackToken);

    let arguments = {
        'token': providerConfig.slackToken
    };

    web.users.list(arguments).then((res) => {
        res.members.forEach(value => {
            if (emails[value.profile.email] != undefined) {
                sendSlackMessage(value.id, appointment, providerConfig.slackToken);
            }
        });
    }).catch(error => {
        console.error('Slack: an error occurred: ', error);
    });
}

function sendSlackMessage(id, appointment, token) {
    const web = new WebClient(token);

    var messageText = 'Reminder: ' + appointment.summary;
    var start;
    var now = new Date();

    if (appointment.start.dateTime != undefined) {
        start = new Date(appointment.start.dateTime);
    } else {
        start = new Date(appointment.start.date);
    }

    if (now < start) {
        msec = start - now;
        var min = Math.floor(msec / 1000 / 60);
        var hour = Math.floor(msec / 1000 / 60 /60);
        messageText = messageText + ' starts in ' + min % 60 + ' minutes' + (hour != 0 ? ' and ' + hour + ' hours!' : '!');
    } else {
        msec = now - start;
        var min = Math.floor(msec / 1000 / 60);
        messageText = messageText + ' started ' + min + ' minutes ago!';
    }

    let arguments = {
        'token': token,
        'channel': id,
        'as_user': 'false',
        'text': messageText
    };

    web.chat.postMessage(arguments).then((res) => {
        console.log('Slack: Sent message: ', res.message.text);
    }).catch(error => {
        console.error('Slack: an error occurred: ', error);
    });
}
