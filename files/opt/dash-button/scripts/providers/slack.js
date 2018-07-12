// require modules needed to send Slack messages
const { WebClient } = require('@slack/client');

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        postMessage(sender, providerConfig);
    }
};

// postMessage uses the Slack api's method chat.postMessage
// Documentation:
// https://api.slack.com/methods/chat.postMessage
function postMessage(sender, providerConfig) {
    const web = new WebClient(providerConfig.token);
    let arguments = {};

    for (let [key, value] of Object.entries(providerConfig)) {
        arguments[key] = value;
    }

    for (let [key, value] of Object.entries(sender.providerConfig)) {
        arguments[key] = value;
    }

    web.chat.postMessage(arguments).then((res) => {
        console.log('Slack: Sent message ', res.message.text);
    }).catch(error => {
        console.error('Slack: an error occurred: ', error.data.error);
    });
}
