## Configure Providers
Below you can find detailed information and configurations for supported providers.

Please be aware that the provider must have the same name as a js file in the providers folder in order to match the provider.

### Bring
Here is a valid configuration for two dash buttons that will add coffee to list X and milk to list Y.

```json
{
  "buttons": [
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "bring",
      "providerConfig": {
        "listId": "xxxxx",
        "productName": "Coffee"
      }
    },
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "bring",
      "providerConfig": {
        "listId": "yyyyy",
        "productName": "Milk"
      }
    }
  ],
  "providerConfig": {
    "bring": {
      "notificationUserId": "xxxxx",
      "notificationApiKey": "xxxxx",
      "notificationUserUuid": "xxxxx",
      "notificationSender": "xxxxx"
    }
  }
}

```

### Slack

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