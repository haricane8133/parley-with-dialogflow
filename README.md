# Parley - Dialogflow Assistant

This is the only package that you would need when building chatbots with Dialogflow. You can build awesome Fulfillments for the bots (no need of firebase functions!) with your own nodeJS servers.

Built with TypeScript, the whole package is extremely well documented. You'll get access easily to all the parameters sent by Dialogflow's Fulfillment JSON through intellisense

## What you get?

### All Chatbot Platforms supported!
- With a call of a single function - Respond to any Platform -> Google Assistant, Facebook Messenger, Microsoft Skype, Slack, Twitter, Viber, Telegram, Kik, Twilio,... etc
- The Response type currently supported for all the platforms are - text, card, suggestions (quick reply), Image

### Manage Dialogflow Contexts with ease in Fulfillment
- Manage Dialogflow contexts with the call of a single function!
- This allowes you to precisely answer all of the user queries and handle exceptions
- You set the output contexts from the Fulfillment rather than hard-coding in Dialogflow (Latter practice would make bots vulnerabe to breakage)

### Flexibility/Ease
- No need of Firebase Functions (the choice of hosting the Fulfiment is left to you)
- Deals with raw JSONs sent by Dialogflow, and provides intellisense wrappers for the same
- Parses all the required parameters from the JSON and gives you a sandbox
- All you need to do is call the function

### Session Management inbuilt
- You can handle Sessions like a pro
- Store separate data based upon the session with different accross the different platforms

## Getting Started

1. Create a bot in [Dialogflow](https://www.dialogflow.com/)
   - Preferably have no output contexts set up in Dialogflow (You can set the context later from your server based upon the user's answer)
2. Configure the fulfillment to your nodeJS server hosted anywhere public (for testing, you can use [ngrok](https://ngrok.com/) and console)
3. Install the package in your server from [NPM](https://www.npmjs.com/) and folow the code samples

## Examples

### Installation

```powershell
```

### Import

TypeScript
```ts
```

JavaScript
```js
```

### Usage

```js

```

## Authors

* **Hari.R** - [haricane8133](https://github.com/haricane8133)

## License

This project is licensed under the GNU GPL V3.0 License - see the [LICENSE.md](LICENSE.md) file for details
