// require modules needed for bringHandler
const { WebClient } = require('@slack/client');

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        postMessage(sender, providerConfig);
    }
};

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
        console.log('Slack: Sent message ', res.ts);
    }).catch(error => {
        console.error('Slack: an error occurred: ', error.data.error);
    });
}
