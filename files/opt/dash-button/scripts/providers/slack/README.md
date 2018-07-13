## Configure Slack

The Slack provider uses `chat.postMessage` function from the official Slack api.

The information configured in the providerConfig will be directly forwarded as Arguments to the api.

All available option for this method can be found on the Slack Homepage [here](https://api.slack.com/methods/chat.postMessage).

Here is an example configuration:

```json
{
  "buttons": [
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "slack",
      "providerConfig": {
        "channel": "xxxxx",
        "username": "wink-bot",
        "text": ":wink:",
        "icon_emoji": "true"
      }
    },
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "bring",
      "providerConfig": {
        "channel": "DBL8WBMSL",
        "text": "Beep"
      }
    }
  ],
  "providerConfig": {
    "slack": {
      "token": "xxxx",
      "username": "dash-bot"
    }
  }
}

```

Note: If an Argument is listed in `providerConfig` and in `buttons.providerConfig` the Argument from `buttons.providerConfig` will override the other.
