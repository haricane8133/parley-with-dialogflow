import * as sstorer from "sstorer";

let platforms = ['FACEBOOK', 'SKYPE', 'SLACK', 'VIBER', 'TELEGRAM', 'KIK'];

const fname = 'sstorer.data';

class StorageTools{
	"startOver": () => void;
	/**
	 * Add / Modify a Variable in the session
	 * 
	 * Auto refreshes the session
	 * 
	 * Auto performes the session activeness check
	 * @param paramName The name of the variable that you want to store
	 * @param paramVal The value of the variabe that you want to store
	 * @returns True if the session is active and the value is inserted
	 * @returns False if the session has expired and storage was not done
	 */
	"put": (paramName: string, paramValue: string) => boolean;
	/**
	 * Get the value of a variabe from the session
	 * @param paramName The name of the variable that you want to get
	 * @returns false if the session is not alive
	 * @returns undefined if there is no such variable is declared in the session
	 * @returns The value of the variable if al OK
	 */
	"get": (paramName: string)=> any;
	/**
	 * Destroyes the storage under the session
	 */
	"end": ()=> void;
	/**
	 * Returns true if the the session is active (time elapsed under 'duration')
	 * @returns True if the session is active
	 * @returns False if the session has expired
	 */
	"status": ()=> boolean;
	/**
	 * This is to refresh the timer in the session
	 */
	"refresh": ()=> boolean;

	constructor(sessionid: string, duration: number) {

		this.startOver  = (): void => {
			this['store'].spawnSession(this['sessionid']);
			this['store'].dump(fname);
		};
		this.end = (): void => {
			this['store'].killSession(this['sessionid']);
			this['store'].dump(fname);
		};
		this.status = (): boolean => {
			let tmp = this['store'].isSessionActive(this['sessionid']);
			this['store'].dump(fname);
			return tmp;
		};
		this.get = (paramName: string): any => {
			let tmp = this['store'].getVar(this['sessionid'], paramName);
			this['store'].dump(fname);
			return tmp;
		};
		this.put = (paramName: string, paramValue: any): boolean => {
			let tmp = this['store'].putVar(this['sessionid'], paramName, paramValue);
			this['store'].dump(fname);
			return tmp;
		};
		this.refresh = (): boolean => {
			let tmp = this['store'].refreshSession(this['sessionid']);
			this['store'].dump(fname);
			return tmp;
		};

		this['sessionid'] = sessionid;
		this['store'] = sstorer.init(duration);
		
		if(this['store'].load(fname) && this.status()){
			this.refresh();
		}
	}
}

class DialogflowRequestJSON {
	/**
	 * Unique ID for the request that was made (that dialogflow uses to uniquely identify requests)
	 */
	"responseId": string;
	/**
	 * contains the "URL" of the session (that dialogflow uses to uniquely identify session)
	 * it's in the format : "projects/<Project ID in google cloud>/agent/sessions/<Session ID>"
	 * These would be parsed by this library
	 */
	"session": string;
	/**
	 * Contains important details about the query
	 */
	"queryResult": {
		/**
		 * Language Code of the request
		 */
		"languageCode": string,
		/**
		 * This is what the user spoke originally to invoke this intent
		 */
		"queryText": string,
		/**
		 * This is the original string given as response in the Dialogflow console for the particular request
		 */
		"fulfillmentText"?: string,
		/**
		 * Returns the name of the action if set in the Dialogflow console
		 */
		"action"?: string,
		/**
		 * This is just to make sure that all the required slots are filled
		 */
		"allRequiredParamsPresent": boolean,
		/**
		 * Here, get the value by giving the parameter name to the JSON
		 * @example parley.JSON.queryResult.parameters["dialogflow param name"]
		 */
		"parameters": {},
		/**
		 * Returns the output contexts from the particular intent, as an array
		 */
		"outputContexts"?: [
			{
				/**
				 * contains the "URL" of the context (that dialogflow uses to uniquely identify contexts)
				 * it's in the format : "projects/<Project ID in google cloud>/agent/sessions/<Session ID>/contexts/<Context Name>"
				 * These would be parsed by this library
				 */
				"name": string,
				/**
				 * Contains the lifespan of the context, after the following intent is fired
				 * This will not be defined if the context dies with this intent. i.e, instead of value 0, its not defined
				 */
				"lifespanCount": number,
				/**
				 * Contains pair of variables for each parameter all in a single JSON
				 * the two are in the format : "<Parameter name>" and "<Parameter name>.original"
				 * They give you the resolved parameter value, and the actual value extracted from the user's text respectively
				 * @example parley.JSON.queryResult.outputContexts.parameters["<Parameter Name>"] or parley.JSON.queryResult.outputContexts.parameters["<Parameter Name>.original"]
				 */
				"parameters"?: {}
			}
		],
		"intent": {
			/**
			 * contains the "URL" of the intent (that dialogflow uses to uniquely identify intents)
			 * it's in the format : "projects/<Project ID in google cloud>/agent/intents/<Intent ID>"
			 * These would be parsed by this library
			 */
			"name": string,
			/**
			 * This is the name of the intent that was defined in the dialogflow console by you
			 */
			"displayName": string
		},
		"fulfillmentMessages"?: [],
		/**
		 * Contains the fraction of confidence that dialogflow has in firing the particular intent for the request
		 */
		"intentDetectionConfidence": number,
		"diagnosticInfo"?: {},
	};
	/**
	 * Some details about the request
	 */
	"originalDetectIntentRequest": {
		"source"?: string,
		"version"?: string,
		"payload": {}
	};

	constructor(body: any) {
		this.responseId = body['responseId'];
		this.session = body['session'];
		this.queryResult = body['queryResult'];
		this.originalDetectIntentRequest = body['originalDetectIntentRequest'];
	}
}

class DialogflowRequest {
	/**Returns the original Request JSON that was sent by Dialogflow */
	"JSON": DialogflowRequestJSON;
	/**The name of the action (is set) from the Dialogflow bot*/
	"actionName"?: string;
	/**The name of the intent fired */
	"intentName": string;
	/**What the user spoke for this intent to be fired */
	"queryText": string;
	/**Parameters that are given to this intent as a result of params passed from previous intents by the use of contexts*/
	"contextParams"?: {};
	/** 
	 * Contexts that's present in this intent
	 * The 'lifetime' parameter would not be defined if the context is not passed to the next intent
	*/
	"contexts"?: any[];
	/**
	 * True if all the parameters defined for the intent has been given by the user
	 */
	"allParamsPresent": boolean;
	/**These are the parameters sent from Dialogflow for this particular intent */
	"params": {};
	/**
	 * This contains the unique session id for the series of requests made by the user
	 * This is required for handling requests from more than one source (separate storage for all the 'sessions' in the server)
	 */
	"sessionid": string;
	/**Contains the project id as defined in the Dialogflow console */
	"projectid": string;
	/**
	 * The language setting used by the user when requesting
	 */
	"lang": string;
	/**The platform from which the user is making the request */
	"sourcePlatform"?: string;

	constructor(body: any) {
		try{
			this.JSON = new DialogflowRequestJSON(body)

			try {
				this.actionName = this.JSON.queryResult.action;
			} catch { }
			try {
				this.lang = this.JSON.queryResult.languageCode;
			} catch { }
			try {
				this.intentName = this.JSON.queryResult.intent.displayName;
			} catch { }
			try {
				this.queryText = this.JSON.queryResult.queryText;
			} catch { }
			try {
				this.contexts = [];
				this.contextParams = {};
				for (let context of this.JSON.queryResult.outputContexts) {
					this.contexts.push(context);
					// format is {"name":"projects/<projectid>/agent/sessions/<sessionid>/contexts/<name>", "lifespanCount":"", "parameters":{"paramname":"paramvalue"}}
					for (let key in context["parameters"]) {
						this.contextParams[key] = context["parameters"][key];
					}
				};
			} catch { }
			try {
				this.allParamsPresent = this.JSON.queryResult.allRequiredParamsPresent;
			} catch { }
			try {
				this.params = this.JSON.queryResult.parameters;
			} catch { }
			try {
				let toparse = this.JSON.session;
				let i = 9;
				this.projectid = '';
				while (toparse[i] != '/') {
					this.projectid += toparse[i];
					i++;
				}
				i = toparse.indexOf("sessions/") + 9;
				this.sessionid = toparse.substring(i);
			} catch { }
			try {
				this.sourcePlatform = this.JSON.originalDetectIntentRequest.source;
			} catch { }
	
			this['response'] = {};
			this['response']['fulfillmentMessages'] = [];
		} catch { }
	}

	/**
	 * Provides you with tools to store data separate for each session
	 * 
	 * A session is a series of conversations made by the user with the bot
	 * 
	 * You can store data in the server using this tool instead of storing data through Dialogflow contexts
	 * @param duration - The lifetime of the session in minutes. After the lifetime of the session, the storage would become invalid
	 * @returns The tool
	 */
	getStorageTool(duration: number): StorageTools {
		return new StorageTools(this.sessionid, duration);
	}
	/**
	 * Use this function to add a text to the response
	 * @param text The text that needs to be responded
	 */
	addText(text: string): void{
		this['response']['fulfillmentMessages'].push({
			"text": {
				"text": [text]
			}
		});
		for (let platform of platforms) {
			this['response']['fulfillmentMessages'].push({
				"text": {
					"text": [text]
				},
				"platform": platform
			});
		}
		this['response']['fulfillmentMessages'].push({
			"platform": "ACTIONS_ON_GOOGLE",
			"simpleResponses": {
				"simpleResponses": [{
					"textToSpeech": text
				}]
			}
		});
	};
	/**
	 * Use this function to add quick reply suggestions
	 * @param theSuggestions the quick replies that needs to be added
	 * @param title A title for the above replies... Can be "You can..."
	 */
	addSuggestions (theSuggestions: string[], title: string): void{
		for (let platform of platforms) {
			this['response']['fulfillmentMessages'].push({
				"quickReplies": {
					"title": title,
					"quickReplies": theSuggestions
				},
				"platform": platform
			});
		}
		this['response']['fulfillmentMessages'].push({
			"platform": "ACTIONS_ON_GOOGLE",
			"suggestions": {
				"suggestions": []
			}
		});
		for (let suggestion of theSuggestions) {
			this['response']['fulfillmentMessages'][this['response']['fulfillmentMessages'].length - 1].suggestions.suggestions.push({
				"title": suggestion
			});
		}
	};
	/**
	 * Use this function to add a card to the response
	 * @param title The title of the card
	 * @param subtitle The sub title of the card
	 * @param imguri Link to an image in the card
	 * @param isButt If you want a URI button in the card
	 * @param buttname Label of the button
	 * @param butturi URI pointed to by the button
	 * @param formattedtext Not Required... just give "". Here for flexibiity
	 * @param imgtext A line about the image
	 */
	addCard(title: string, subtitle: string, imguri: string, isButt: boolean, buttname: string, butturi: string, formattedtext: string, imgtext: string) : void {
		if (isButt) {
			for (let platform of platforms) {
				this['response']['fulfillmentMessages'].push({
					"card": {
						"title": title,
						"subtitle": subtitle,
						"imageUri": imguri,
						"buttons": [{
							"text": buttname,
							"postback": butturi
						}]
					},
					"platform": platform
				});
			}
			this['response']['fulfillmentMessages'].push({
				"platform": "ACTIONS_ON_GOOGLE",
				"basicCard": {
					"title": title,
					"subtitle": subtitle,
					"formattedText": formattedtext,
					"image": {
						"imageUri": imguri,
						"accessibilityText": imgtext
					},
					"buttons": [{
						"title": buttname,
						"openUriAction": {
							"uri": butturi
						}
					}]
				}
			});
		} else {
			for (let platform of platforms) {
				this['response']['fulfillmentMessages'].push({
					"card": {
						"title": title,
						"subtitle": subtitle,
						"imageUri": imguri,
						"buttons": []
					},
					"platform": platform
				});
			}
			this['response']['fulfillmentMessages'].push({
				"platform": "ACTIONS_ON_GOOGLE",
				"basicCard": {
					"title": title,
					"subtitle": subtitle,
					"formattedText": formattedtext,
					"image": {
						"imageUri": imguri,
						"accessibilityText": imgtext
					},
					"buttons": []
				}
			});
		}
	};
	/**
	 * Not Available for the google platform. Use Card directly
	 * @param imguri The link pointing to the image
	 */
	addImage (imguri: string){
		for (let platform of platforms) {
			this['response']['fulfillmentMessages'].push({
				"image": {
					"imageUri": imguri
				},
				"platform": platform
			});
		}
	};
	/**
	 * Add an output context to the response from this intent
	 * @param contextname Name of the context you want to set
	 * @param lifetime The lifetime of the context (after how many intents the context must die)
	 * @param params A JSON contaning the parameters to be passed along with the context
	 */
	addOutputContext(contextname: string, lifetime: number, params: any){
		let a = {};
		a['name'] = "projects/" + this.projectid + "/agent/sessions/" + this.sessionid + "/contexts/" + contextname;
		a['lifespanCount'] = lifetime;
		a['parameters'] = params;
		if(this['response']['outputContexts'] == undefined){
			this['response']['outputContexts'] = [];
		}
		this['response']['outputContexts'].push(a);
	};
	/**
	 * Use this function to replicate the input contexts to the output contexts
	 * 
	 * Useful in case where you have all output contexts with lifetime 1 and you hit a point where the user enters a wrong input
	 * @param inputContexts 
	 */
	addAllInputContexts(){
		this['response']['outputContexts'] = [];
		for (let inputContext of this.contexts){
			inputContext['lifespanCount'] = '1';
			inputContext['parameters'] = {};
			this['response']['outputContexts'].push(inputContext);
		}
	};
	/**
	 * Returns the response that was formed till now. Send this object as a response to Dialogflow
	 * @returns Response Object
	 */
	getResponse(): any {
		return this['response'];
	}
	/**
	 * End the conversation
	 * @returns The JSON response that needs to be sent to Dialogflow
	 * @example res.send(endConversation());
	 */
	endConversation(): any{
		this['response'].payload = {
			"google":{
				"expectUserResponse": false
			}
		};
		return this['response'];
	};

// FINDINGS
/*
in google card, the buttons act only for opening URLs
in other cards, the buttons act either as URLs or reply text
For google, in order to make rich messages, we need to give atmost 2 simple responses
*/
}

/**
 * This is a function that will parse the incoming request and return a sandbox object that allows you, the programmer, to easily perform fulfillment
 * 
 * All the hardwork is taken care of, and you can focus on your bot
 * @Note For all the optional properties (marked with '?'), you need to perform a check whether they are 'undefined' (depends upon Dialogflow bot)
 * @argument body - The JSON sent by the POST request from Dialogflow to your server as fulfillment
 * @returns sandbox that provides you with all the functions required
 * @author Hari.R aka haricane8133
 */
export function parse(body: any) : DialogflowRequest {
	return new DialogflowRequest(body);
};