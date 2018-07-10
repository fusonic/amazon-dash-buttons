/*** CONFIG  ***/

const listId = "xxxxx";

const buttonConfig = [
    {
        buttonAddress: "aa:aa:aa:aa:aa:aa",
        productName: "Produkt 1"
    },
    {
        buttonAddress: "aa:aa:aa:aa:aa:aa",
        productName: "Produkt 2"
    }
];

/*** CODE  ***/

const button = require('node-dash-button');
const https = require('https');
const request = require('request');

buttonConfig.forEach(function(value) {  
    console.log('Configuring button {' + value.buttonAddress + '} for product {' + value.productName + '}')
    var dash = button(value.buttonAddress, null, null, 'all');
    dash.on("detected", function (){
        addToBringList(value.productName);
    });
});

function addToBringList(item)
{
    var options = {
        body: "specification=&purchase=" + encodeURIComponent(item)
    };

    request
        .put('https://api.getbring.com/rest/bringlists/' + listId, options)
        .on('response', function(response)
        {
            console.log("Added {" + item + "} to shopping list {" + listId + "}");
            sendNotification();
        });
}

function sendNotification() {

    var options = { 
        headers: {
            'x-bring-country': 'AT',
            'user-agent': 'okhttp/3.4.1',
            'accept-language': 'de-at',
            'x-bring-version': '303070300',
            'x-bring-client': 'android',
            'x-bring-user-ad-id': 'xxxxx',
            'x-bring-api-key': 'xxxxx',
            'x-bring-user-uuid': 'xxxxx' 
        },
        body: 
            'bringListUuid=' + listId + '&type=CHANGED_LIST&sender=xxxxx' 
    };

    request
        .post('https://api.getbring.com/rest/notifications', options)
        .on('response', function(response)
        {
            console.log("Sent notification...");
        });
}
