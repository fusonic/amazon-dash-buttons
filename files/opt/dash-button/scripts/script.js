const button = require('node-dash-button');
const fs = require('node-fs');
const pathToConfig = ('/opt/dash-button/config/config.json');

// Load config.json
let config = readConfig(pathToConfig);
let buttonConfig = config['buttons'];
let providerConfig = config['providerConfig'];

// Load providers
let providers = {};
Object.keys(providerConfig).forEach(value => {
    providers[value] = require('./providers/'+ value + '/' + value);
});

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

function readConfig(pathToConfig) {
    try {
        return JSON.parse(fs.readFileSync('/opt/dash-button/config/config.json'));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    // Function for updating config.json if providerData changed
    updateProviderConfig: function (provider, providerName) {
        try {
            providerConfig[providerName] = provider;
            config.providerConfig = providerConfig;
            fs.writeFile(pathToConfig, JSON.stringify(config), 'utf8', function (res) {
                console.log(res);
            });
        } catch (error) {
            console.log(error);
        }
    }
};
