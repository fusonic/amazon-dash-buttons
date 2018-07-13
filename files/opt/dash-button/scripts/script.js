const button = require('node-dash-button');
const fs = require('node-fs');

// Load config.json
const configJSON = fs.readFileSync('/config.json');
const config = JSON.parse(configJSON);
const buttonConfig = config.buttons;
const providerConfig = config.providerConfig;

// Load providers
let providers = {};
Object.keys(providerConfig).forEach(value => {
    providers[value] = require('./providers/'+ value + '/' + value);
});

//providers["googlecal"].dashHandler(buttonConfig[0], providerConfig["googlecal"]);

// Add handler for each dash-button
buttonConfig.forEach(value => {
    console.log('Configuring Button {' + value.mac + '} for provider ' + value.provider);
    let dash = button(value.mac, null, null, 'all');
    dash.on('detected', function (){
        dashHandler(value);
    });
});

// Call handler specified for provider
function dashHandler(sender) {
    providers[sender.provider].dashHandler(sender, providerConfig[sender.provider]);
}
