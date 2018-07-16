const http = require('http');
const request = require('request');

// export module for main script
module.exports = {
    dashHandler : function (sender, providerConfig) {
        requestHandler(sender, providerConfig);
    }
};

function requestHandler(sender, providerConfig) {
    var options  = prepareOptions(sender, providerConfig);
    var url = prepareUrl(sender, providerConfig);

    if (sender.providerConfig.method == 'post') {
        request
            .post(url, options)
            .on('response', function (response) {
                console.log('Webhook: POST request to: ' + providerConfig.url + ' was send and returned status Code: ' + response.statusCode);
            });
    } else {
        request
            .get(url, options)
            .on('response', function (response) {
                console.log('Webhook: GET request to: ' + providerConfig.url + ' was send and returned status Code: ' + response.statusCode);
        });
    }
}

function prepareOptions(sender, providerConfig) {
    var options = {};

    if (sender.providerConfig.headers != undefined) {
        options.headers = sender.providerConfig.headers;
    }

    options.headers['Content-Type'] = 'text/json';

    if (sender.providerConfig.body != undefined) {
        options.body = JSON.stringify(sender.providerConfig.body);
    }

    return options;
}

function prepareUrl(sender, providerConfig) {
    var url = providerConfig.url;

    if (sender.providerConfig.url != undefined) {
        url = sender.providerConfig.url;
    }

    if (sender.providerConfig.parameters != undefined) {
        url = url + '?';
        Object.keys(sender.providerConfig.parameters).forEach(key => {
            url = url + key + "=" + sender.providerConfig.parameters[key];
        });
    }

    return url;
}
