## Amazon-Dash-Buttons

A docker image for listening on Amazon Dash Buttons and trigger events when one gets clicked.

You can get the builded docker image form here:

[Docker Hub](https://hub.docker.com/r/fusonic/amazon-dash-buttons/)

### Prerequisities


In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Usage

#### Run Command

You will have to configure a config.json to configure your Amazon Dash Buttons and give parameters to the Services. 

To start the docker container use the following command: 

```bash
docker run -d --name dash-button --net=host --restart unless-stopped --privileged -v /pathToConfig.json:/config.json fusonic/amazon-dash-buttons:latest
```

Change pathToconfig.json to match your config.json file.

##### Falgs needed due to:

* `--net` - have access to the network, which dash-buttons are connected to
* `--privileged` - being able to inspect packages in the host system
* `-v` - mount the json file into container

#### Create config.json

There is a example.config.json located in the root of the projekt, where you can see how your config file could look like.

Here is an example on how to configure a dash button:

```json 
{
  "mac": "xx:xx:xx:xx:xx:xx",
  "provider": "slack",
  "providerConfig": {
  "channel": "xx",
  "username": "dash-bot",
  "text": "hello world!"
  }
}
```

### Built With

* Docker
* NodeJS

### Find Us

* [Our Homepage](https://www.fusonic.net/)
* [GitHub](https://github.com/fusonic)
* [DockerHub](https://hub.docker.com/u/fusonic/)

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.