// require modules needed to send Slack messages
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { WebClient } = require('@slack/client');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        meetingReminderHandler(sender, providerConfig);
    }
};

function meetingReminderHandler(sender, providerConfig) {
    try {
        const content = providerConfig.secretFile;
        authorize(content, readEvent, sender, providerConfig);
    } catch (err) {
        return console.log('Error loading client secret file:', err);
    }
}

 // Create an OAuth2 client with the given credentials, and then execute the given callback function.
function authorize(credentials, callback, sender, providerConfig) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    let token = {};
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    if (providerConfig.googleToken != undefined) {
        token = providerConfig.googleToken;
    } else {
        getAccessToken(oAuth2Client, callback, sender, providerConfig);
    }

    // Check if we have previously stored a token.
    if (providerConfig.googleToken != undefined) {
        token = providerConfig.googleToken;
    } else {
        return getAccessToken(oAuth2Client, callback, sender, providerConfig, function (res) {
            console.log(res);
        });
    }
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client, sender, providerConfig);
}

 // Get and store new token after prompting for user authorization, and then
 // execute the given callback with the authorized OAuth2 client.
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
                providerConfig['googleToken'] = token;
                const updateProviderConfig = require('../../script');
                updateProviderConfig.updateProviderConfig(providerConfig,'meetingReminder');
            } catch (err) {
                console.error(err);
            }
            callback(oAuth2Client, sender, providerConfig);
        });
    });
}

// Reads google calender event and calls send message function
function readEvent(auth, sender, providerConfig) {
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
            emails[value.email] = value.email;
        });
        sendSlackReminder(emails, events[0], sender, providerConfig);
    });
}

// Searches for userIds to send Slack message and calls send function
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

// Sends reminder for appointment via Slack
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
