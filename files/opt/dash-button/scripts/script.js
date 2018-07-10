const button = require('node-dash-button');
var fs = require('node-fs');

// Load config.json
const configJSON = fs.readFileSync("/config.json");
const config = JSON.parse(configJSON);
const buttonConfig = config.buttons;
const providerConfig = config.providerConfig;

// Load providers
var providers = {};
Object.keys(providerConfig).forEach(function(value) {
    providers[value] = require('./providers/'+ value);
});

// Add handler for each dash-button
buttonConfig.forEach(function(value) {
    console.log('Configuring Button ' + value.mac + '} for provider ' + value.provider);
    var dash = button(value.mac, null, null, 'all');
    dash.on("detected", function (){
        dashHandler(value);
    });
});

// Call handler specified for provider
function dashHandler(sender) {
    providers[sender.provider].dashHandler(sender, providerConfig[sender.provider]);
}
