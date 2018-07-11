// require modules needed for bringHandler
const { WebClient } = require('@slack/client');

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        slackHandler(sender, providerConfig);
    }
};

function slackHandler(sender, providerConfig) {
    console.log('beep');
}

