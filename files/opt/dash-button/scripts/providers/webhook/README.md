## Configure Webhook

Webhook allows you to send a simple GET or POST request.

You can configure a default url in the `providerConfig` section of your config.json.

Under `buttons[i].providerConfig` you can change the method to `post` (default being `get`) and you have the option to add a `body` or `headers`.
Under `parameters ` you can add values that will be added as url parameters.

```json
{
  "buttons": [
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "webhook",
      "providerConfig": {
        "url": "http://httpbin.org/response-headers",
        "method": "get",
        "parameters": {
          "id": 1
        }
      }
    },
    {
      "mac": "xx:xx:xx:xx:xx:xx",
      "provider": "webhook",
      "providerConfig": {
        "url": "http://httpbin.org/post",
        "method": "post",
        "headers": {},
        "body": {
          "message": "Hello"
        }
      }
    }
  ],
  "providerConfig": {
    "webhook": {
      "url": "http://httpbin.org/"
    }
  }
}

```
