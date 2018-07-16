## Configure Slack

The Meeting Reminder takes an event from a given Google Calender and sends a reminder to all attendants on Slack.
(E-Mail addresses are for finding attendants on Slack)

You will have to set up a project and enable it on Google in order to use the Calender api.
You can follow Step 1 of Googles Node.js Quickstart [here](https://developers.google.com/calendar/quickstart/nodejs).
After creating and downloading the client configuration, copy the content of the json file to the "secretFile" field in your config.json.

The time parameter allows to control when the event has to have it's endtime. (If you insert 10 it will take the first event with an endtime after the next 10 minutes)

Here is an example configuration:

```json
{
  "buttons": [
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "meetingReminder",
      "providerConfig": {
        "calendarId": "primary",
        "time": "now"
      }
    },
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "meetingReminder",
      "providerConfig": {
        "calendarId": "primary",
        "time": "10"
      }
    }
  ],
  "providerConfig": {
    
  }
}

```
