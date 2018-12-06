# Parley - Dialogflow Assistant

This is the only package that you would need when building chatbots with Dialogflow. You can build awesome Fulfillments for the bots with your own nodeJS servers (no need of firebase functions!)

Built with **TypeScript**, the whole package is extremely well documented. You'll get access easily to all the parameters sent by Dialogflow's Fulfillment JSON through intellisense

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
npm i parley-with-dialogflow
```

### Import

TypeScript
```ts
import * as Parley from "parley-with-dialogflow";
// or import Parley = require('parley-with-dialogflow');
```

JavaScript
```js
var Parley = require('parley-with-dialogflow')
```

### Usage

Examples with [expressJS](https://expressjs.com/)

**Request and Response**
```js
// Within the POST request handler of your server (that route that handes dialogflow fulfillments)
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/dialog', (req, res, next) => {
   let parley = Parley.parse(req.body); 
   /*If you are not using express, make sure that you give the JSON from POST directly
    the .parse() parses the JSON and returns a sandbox object with which you can perform
    all the operations you can ever dream of*/
   
   if(parley.intentName == 'Intent 1'){
      let name = parley.params['name']; // Gets the parameter from Dialogflow, under the name 'name'
      parley.addText('Hello There' + name); // Adds a text response
      parley.addText('Thank you for coming to Intent 1'); // Adds another text response
      parley.addOutputContext('await-intent-2'); // Adds an output context with the name 'await-intent-2'
      parley.addSuggestions(["I'll proceed", "I'll Stop"]); // Adds quick reply options for the user
   } else if(parley.intentName == 'Intent 2'){
      parley.addText('Thank you for coming to Intent 2'); // Adds a text response
      parley.endConversation(); // Ends the conversation (in case of user in google Assistant, this is required)
   } else if(parley.intentName == 'Fallback 1'){
      parley.addText("I can't understand. Please rephrase your answer"); // Adds a text response
      parey.addAllInputContexts();
      //This will Make sure the user is given chances if he enters wrong (without contexts with lifetime)
   }
   
   let response = parley.getResponse(); 
   // returns the formed response JSON in the Dialogflow format that applies to any chat platform
   
   res.send(response); // you send the response JSON back to Dialogflow
});
```

**Using the Session Storage**

```js
// Within the POST request handler of your server (that route that handes dialogflow fulfillments)
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/dialog', (req, res, next) => {
   let parley = Parley.parse(req.body);
   let store = parley.getStorageTool(sessionduration); // Get the Storage sandbox for all session storage related operations
   
   if(parley.intentName == 'Intent 1'){
      store.startOver(); // This is put in all the starting intents to 'startOver' the session storage
      let name = parley.params['name'];
      store.put('username', name);
      // Stores the name parameter safely in this session and can be accessed in the same session and within the session duration
      
      parley.addText('Hello ' + name);
   } else if(parley.intentName == 'Intent 2'){
      let name = store.get('username'); // retrieve the parameter within the same session easiy (we can now get rid of context parameters)
      parley.addText("That's great to hear " + name);
      parley.endConversation();
   }
   
   let response = parley.getResponse();
   res.send(response);
});

// Like this you can get all the parameters sent by Dialogflow
```

**We've barely scratched the surface**
*Explore with intellisense to discover all the features*

## Authors

* **Hari.R** - [haricane8133](https://github.com/haricane8133)

## License

This project is licensed under the GNU GPL V3.0 License - see the [LICENSE.md](LICENSE.md) file for details
