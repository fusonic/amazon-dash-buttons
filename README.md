## Amazon-Dash-Buttons

A docker image for listening on Amazon Dash Buttons and trigger events when one gets clicked.

You can get the build docker image form here:

[Docker Hub](https://hub.docker.com/r/fusonic/amazon-dash-buttons/)

### Prerequisities

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Usage

#### Run Command

You will have to configure a config.json to configure your Amazon Dash Buttons and give information to services. 

To start the docker container use the following command: 

```bash
docker run -d --name dash-button --net=host --restart unless-stopped --privileged -v /pathToConfig.json:/config.json fusonic/amazon-dash-buttons:latest
```

Change pathToConfig.json to match your config.json file.

##### Flags needed due to:

* `--net` - have access to the network, which dash-buttons are connected to
* `--privileged` - being able to inspect packages in the host system
* `-v` - mount the json file into container

#### Create config.json

There is a [config.example.json](config.example.json) located in the root of the project, where you can see how your config file could look like.

Here is an example on how to configure a dash button:

```json 
"buttons": [
  {
    "mac": "xx:xx:xx:xx:xx:xx",
    "provider": "slack",
    "providerConfig": {
    "stuffForProvider": "beep"
    }
  }
]
```

And a provider:

```json
"providerConfig": {
  "slack": {
    "stuffForProvider": "beep"
  }
}
```

A complete [config.json](config.example.json) could look like this:

```json
{
  "buttons": [
    {
      "mac": "xxxx",
      "provider": "slack",
      "providerConfig": {
        "channel": "xxxx",
        "username": "dash-bot",
        "text": ":grin:",
        "icon_emoji": "true"
      }
    }
  ],
  "providerConfig": {
    "slack": {
      "token": "xxxx"
    }
  }
}
```

#### Providers

Currently the following providers are supported:

* [Bring](https://getbring.com/)
* [Slack](https://slack.com/)

If the provider you are looking for is currently not supported, feel free to integrate it into the project. Therefore have a look at the Contribute section.

#### Documentation on Providers

There is a detailed README.md file covering how to configure your config.json [here](files/opt/dash-button/scripts/providers/README.md).

You can also find the file here well formated on [Github](https://github.com/fusonic/amazon-dash-buttons/blob/master/files/opt/dash-button/scripts/providers/README.md).

### Contribute

#### Add a new Provider

To add a new provider you must create a JavaScript file in files/opt/dash-button/scripts/providers/providerName/providerName.js and register the provider as a module.

Here an example on [Slack](files/opt/dash-button/scripts/providers/slack/slack.js)

```javascript
module.exports = {
    dashHandler : function (sender, providerConfig) {
       // magic
    }
};

```

Note: the file must have the same name as the provider declared in the config.json!

The `dashHandler` function is called with two parameters:

 * `sender` - containing information from button
 * `providerConfig` - containing information 
 
 With these parameters you can access information declared in the config.json file.
 
#### Run command for developing

We created a rundev file that mounts the scrips folder as a volume, which is useful for developing new features.

``` bash
    # build docker image for development
    docker build -t dev/dash-buttons .
    # start run file
    ./rundev
```
 
### Built With

* Docker
* NodeJS

### Find Us

* [Our Homepage](https://www.fusonic.net/)
* [GitHub](https://github.com/fusonic)
* [DockerHub](https://hub.docker.com/u/fusonic/)

### License

This project is licensed under the MIT License.