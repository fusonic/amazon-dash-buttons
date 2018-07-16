## Configure Slack

The Meeting Reminder is a 

Here is an example configuration:

```json
{
  "buttons": [
    {
      "mac": "0c:47:c9:1f:b1:76",
      "provider": "meetingReminder",
      "providerConfig": {
        "calendarId": "primary",
        "time": "now"
      }
    }
  ],
  "providerConfig": {
    "meetingReminder": {
      "slackToken": "xoxp-110879557975-394888405667-396605363251-b712ded00b6ed38f569952911f217e41"
    }
  }
}

```

