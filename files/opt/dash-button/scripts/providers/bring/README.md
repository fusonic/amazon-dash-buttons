## Configure Bring

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
