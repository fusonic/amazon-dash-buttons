// require modules needed for bringHandler
const https = require('https');
const request = require('request');

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        bringHandler(sender, providerConfig);
    }
};

function bringHandler(sender, providerConfig) {
    var options = {
        body: 'specification=&purchase=' + encodeURIComponent(sender.providerConfig.productName)
    };

    request
        .put('https://api.getbring.com/rest/bringlists/' + sender.providerConfig.listId, options)
        .on('response', function (response) {
            console.log('Bring: Added {' + sender.providerConfig.productName + '} to shopping list {' + sender.providerConfig.listId + '}');
            sendNotification(sender, providerConfig);
        });
}

function sendNotification(sender, providerConfig) {
    var options = {
        headers: {
            'x-bring-country': 'AT',
            'user-agent': 'okhttp/3.4.1',
            'accept-language': 'de-at',
            'x-bring-version': '303070300',
            'x-bring-client': 'android',
            'x-bring-user-ad-id': providerConfig.notificationUserId,
            'x-bring-api-key': providerConfig.notificationApiKey,
            'x-bring-user-uuid': providerConfig.notificationUserUuid
        },
        body:
        'bringListUuid=' + sender.providerConfig.listId + '&type=CHANGED_LIST&sender=' + providerConfig.notificationSender
    };

    request
        .post('https://api.getbring.com/rest/notifications', options)
        .on('response', function (response) {
            console.log('Bring: Sent notification for product ' + sender.providerConfig.productName);
        });
}
