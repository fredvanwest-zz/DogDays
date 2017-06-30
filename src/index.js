/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/


// Doggy Test cases
// Birthdates:
//  *) Last Christmas - Legal
//  *) April 1st - Legal
//  *) Yesterday - Legal but should yield close to zero.
//  *) Last Saturday - Legal but should yield close to zero
//  *) Next Monday - Illegal - Error Message
//  *) This Saturday - Illegal - Error Message
//  *) Tomorrow - Illegal - Error Message
//  *) Today - Legal but should yield exactly zero.
//  *) January 1, 1970 - Illegal - Error Message

// Dog Days
// Each entry in the dogTable has aging for small, medium and large dogs.
// Note: For the first 6 years, dogs age the same and then larger dogs age faster than smaller ones.
// Small dogs are 20 lbs or less, large dogs are 50 lbs or more and medium dogs are 21-50 lbs.
const dogTable = [
    [ [15,"a puppy"], [15,"an puppy"], [15,"a puppy"] ],
    [ [24,"a puppy"], [24,"a puppy"], [24,"a puppy"] ],
    [ [28,"an adult"], [28,"an adult"], [28,"an adult"] ],
    [ [32,"an adult"], [32,"an adult"], [32,"an adult"] ],
    [ [36,"an adult"], [36,"an adult"], [36,"an adult"] ],
    [ [40,"an adult"], [42,"a senior"], [45,"a senior"] ], // First year that starts to diverge
    [ [44,"an adult"], [47,"a senior"], [50,"a senior"] ],
    [ [48,"an adult"], [51,"a senior"], [55,"a senior"] ],
    [ [52,"a senior"], [56,"a senior"], [61,"a senior"] ],
    [ [56,"a senior"], [60,"a geriatric"], [66,"a geriatric"] ],
    [ [60,"a senior"], [65,"a geriatric"], [72,"a geriatric"] ],
    [ [64,"a senior"], [69,"a geriatric"], [77,"a geriatric"] ],
    [ [68,"a geriatric"], [74,"a geriatric"], [82,"a geriatric"] ],
    [ [72,"a geriatric"], [78,"a geriatric"], [88,"a geriatric"] ],
    [ [76,"a geriatric"], [83,"a geriatric"], [93,"a geriatric"] ],
    [ [80,"a geriatric"], [87,"a geriatric"], [120,"a geriatric"] ]
];


// Image Sizes: Small - 720w x 480h, Large - 1200w x 800h

const imgTable = [
    "https://s3.amazonaws.com/raindex/smallDog.png", // Small dog image
    "https://s3.amazonaws.com/raindex/mediumDog.png", // Medium Dog image
    "https://s3.amazonaws.com/raindex/largeDog.png" // Large dog image.
]
// Icon Sizes are 108 x 108 and 512 x 512
const averageYear = 365.25;

const dateFormat = "YYYY-MM-DD"; // Date format returned by the Alexa delegate.

// 6/21/2017 - TODO Remaining Tasks:
// *) Refactor dates using Moment.js [x]
// *) Cut out images for Small, Medium, Large dogs and paste into S3 buckets [x]
// *) Create Amazon Alexa card and add prompting to user to look for it. [x]
// *) Improve prosody of prompts using SSML [ ]
// *) Develop Large and Small Icons for application. [x]
// *) Error handling (dates > 16 years, invalid birthdays.)
// *) Features remaining:
//      *) Speak dog size in pounds or kilograms and match to small, medium, large
//      *) Re-prompt for more dogs.
//      *) Re-prompt to read results again.
//      *) Add your birthdate to find out when your doggie cross-over date is. (UNIQUE FEATURE).
//      *) Consider adding a Calendar event to your email registered in your Alexa account (so I don't have to prompt for email.)


 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function

 var speechOutput;
 var reprompt;
 var welcomeOutput = "Welcome to Dog Days, the most accurate way to tell you how old your dog is in human years.  Is your dog a large dog, medium dog or small dog?";
 var welcomeReprompt = "Small dogs are under 20 pounds and large dogs are more than fifty pounds.  Is your dog a large dog, medium dog or small dog?";
 var dogSkillIntro = [
   "Dogs are so adorable. ",
   "Dogs enrich our lives so much. ",
   "Dogs age differently based on their sizes. "
 ];

 // 2. Skill Code =======================================================================================================

'use strict';
var Alexa = require('alexa-sdk');
var moment = require('moment');
var APP_ID = "amzn1.ask.skill.44ff31ff-b2bc-488d-8f0a-c11a45e87dc5";

var handlers = {
    'LaunchRequest': function () {
      this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'dogDaysIntent': function () {
        //delegate to Alexa to collect all the required slot values
        var filledSlots = delegateSlotCollection.call(this);

        //compose speechOutput that simply reads all the collected slot values
        var speechOutput = randomPhrase(dogSkillIntro);

        var dogSizeSyn=this.event.request.intent.slots.dogSize.value;
        // So, it turns out when you utter a synonym, you don't get the canonical value 
        // in the dogSize slot and instead get the synonym.  This was not obvious so I dug into
        // the returned intent JSON and found the actual value uder the resolutionsPerAuthority array as seen
        // below.  Now when you utter, say, "tiny", the code will interpret this as "small."  It might
        // be cute to read the synonym back instead of the slot value, but this could also be confusing
        // so we'll read the canonical value back.  By the way, we'll ALWAYS select the first value back in the
        // values array since it's likely to be the most accurate (and there will always be a zeroth value).
        var dogSize=this.event.request.intent.slots.dogSize.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        if (dogSizeSyn !== dogSize) {
            console.log("Synonym [" + dogSizeSyn + "] is interpreted as a [" + dogSize+ "] size dog.");
        } else {
            console.log("No synonym detected.  dogSize is [" + dogSize +"]");
        }
        /*
        // Note: the word "average" scored as both large and medium.  I didn't see any confidence score that indicated
        // to pick one over the other.  Clearly average as large is incorect but I don't want to misinterpret and always
        // pick the last slot value (which is counterintuitive anyways.)  Average has been removed from the grammar.
        this.event.request.intent
        {
    "name": "dogDaysIntent",
    "confirmationStatus": "NONE",
    "slots": {
        "dogSize": {
            "name": "dogSize",
            "value": "average",
            "resolutions": {
                "resolutionsPerAuthority": [
                    {
                        "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.44ff31ff-b2bc-488d-8f0a-c11a45e87dc5.DOG_SIZES",
                        "status": {
                            "code": "ER_SUCCESS_MATCH"
                        },
                        "values": [
                            {
                                "value": {
                                    "name": "large",
                                    "id": "afacdb0a401ccdf6b48551bbc00e8a74"
                                }
                            },
                            {
                                "value": {
                                    "name": "medium",
                                    "id": "075a3e36a0a52dcbc568c05788e8a713"
                                }
                            }
                        ]
                    }
                ]
            },
            "confirmationStatus": "NONE"
        },
        "dogBirthdate": {
            "name": "dogBirthdate",
            "value": "2009-01-01",
            "confirmationStatus": "NONE"
        }
    }
}
        */
        
        var col = 0;
        if(dogSize === 'small') {
            col = 0;
        } else if (dogSize === 'medium') {
            col = 1;
        } else if (dogSize === 'large') {
            col = 2;
        } else {
            col = -1;
        }

        var img;
        if (col === -1) {
            img = imgTable[0];
        } else {
            img = imgTable[col];
        }
        
        var dogBirthdate=this.event.request.intent.slots.dogBirthdate.value;
        
        var dogBirthdateMoment = moment(dogBirthdate, dateFormat);
        var nowMoment = moment(); // Duh!
        var MAX_DELTA = nowMoment.diff(16, 'years');
        var years = nowMoment.diff(dogBirthdateMoment, 'years');
        
        if( col === -1) {
            console.log("Unrecognized dog size [" + dogSize + "]");
            speechOutput = "I didn't recognize that size of dog.  Goodbye!";
            fact = "Dog size [" + dogSize + "] is not supported.";
        }
        else if (dogBirthdateMoment.isAfter(nowMoment)) {
            console.log("Bad dogBirthdate [" + dogBirthdate + "]");
            speechOutput = "I'm sorry, but that is an ineligible birthdate.  Goodbye!";
            fact = "Dog birthdate [" + dogBirthdate + "] was in the future.";
        } else if (years > 15) {
            console.log("Bad dogBirthdate [" + dogBirthdate + "]");
            speechOutput = "I'm sorry, but I don't have information for dogs of that age.  Goodbye!";   
            fact = "Dog birthdate [" + dogBirthdate + "] was too far in the past.";
        } else {
        
        speechOutput+= " For a "+ dogSize + " dog born on " + dogBirthdate + " ";
        
        console.log("Dog birthdate is [" + dogBirthdate + "]"); // Format is ISO or YYYY-MM-DD which should be parseable.
        
        var dogBirthdayThisYear = dogBirthdateMoment.add(years,'years'); // Dog's birthday this year.
        
        var daysIntoYear = nowMoment.diff(dogBirthdayThisYear, 'days'); // Days since last birthday
        
        console.log("Your dog is [" + years + "] and [" + daysIntoYear + "] days old today.");
        
        // Need to guard against invalid years (i.e. > 16)
        // Or we can do an extrapolation based on the data.
         
        var yearPtr = years - 1; // Note array is zero based!
        
        // Can we do this as a map?
        var dogYear = 0;
        var ageCategory = "a puppy";
        var deltaTuple = dogTable[dogYear][col];
        var delta = deltaTuple[0] - dogYear;    
        
        if(yearPtr >= 0) {
            console.log("Year is [" + yearPtr + "] and col is [" + col + "]");
            // Here is where we *could* extrapolate past 16 years
            var tuple = dogTable[yearPtr][col];
            dogYear = tuple[0];
            ageCategory = tuple[1];
            deltaTuple = dogTable[yearPtr+1][col];
            delta = deltaTuple[0] - dogYear;
        } else {
            console.log("Year is [0] and col is [" + col + "]");
        }

        console.log("dogYear is [" + dogYear + "] and ageCategory is [" + ageCategory + "]");
        
        // Now we need to interpolate to get the spot in between years.
        console.log("Delta between years is [" + delta + "]");
        
        // So the ratio of offset to 365 is the percentage of the delta to add.
        console.log("Offset is [" + daysIntoYear + "] days from your dog's birthday.");
        var deltaYears = ((daysIntoYear * delta)/averageYear);
        console.log("deltaYears [" + deltaYears + "]")
        
        var humanYears = dogYear + deltaYears; // This needs to be truncated to 2 decimal digits of precision.
        humanYears = Math.round(humanYears * 100)/100; // Q&D 2 digit precision.
        var factYearPhrase = "[" + years + "] years";
        if (years === 1) {
            factYearPhrase = "[" + years + "] year";
        }
        console.log("Human years is [" + humanYears + "]");
        var fact = "Your " + dogSize + " dog born on " + dogBirthdate + " is " + factYearPhrase + " and [" + daysIntoYear + "] days old today and is considered " + ageCategory + " dog.  That is " + humanYears + " in human years.";
        var yearPhrase = years + " years";
        if (years === 1) {
            yearPhrase = years + " year";
        }
        speechOutput += " Your dog is " + yearPhrase + ", " + daysIntoYear + " days old today and is considered " + ageCategory + " dog.  That's " + humanYears + " in human years.";
    }
        
        var imageObj = {
                    smallImageUrl: img,
                    largeImageUrl: img
                };
        
        //say the results
        this.emit(':tellWithCard', speechOutput, "Dog Days", fact, imageObj);
    },
    'AMAZON.HelpIntent': function () {
        console.log("Help invoked.");
        speechOutput = welcomeOutput;
        reprompt = welcomeReprompt;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        console.log("Cancel invoked.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        console.log("Stop invoked.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.LoopOffIntent': function () {
        console.log("AMAZON.LoopOffIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.LoopOnIntent': function () {
        console.log("AMAZON.LoopOnIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.NextIntent': function () {
        console.log("AMAZON.NextIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.NoIntent': function () {
        console.log("AMAZON.NoIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.PauseIntent': function () {
        console.log("AMAZON.PauseIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.PreviousIntent': function () {
        console.log("AMAZON.PreviousIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.RepeatIntent': function () {
        console.log("AMAZON.RepeatIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.ResumeIntent': function () {
        console.log("AMAZON.ResumeIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.ShuffleOffIntent': function () {
        console.log("AMAZON.ShuffleOffIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.ShuffleOnIntent': function () {
        console.log("AMAZON.ShuffleOnIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StartOverIntent': function () {
        console.log("AMAZON.StartOverIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.YesIntent': function () {
        console.log("AMAZON.YesIntent.");
        speechOutput = "Goodbye!";
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        console.log("Speech ended request invoked.");
        var speechOutput = "We're done.";
        this.emit(':tell', speechOutput);
    },
    'Unhandled': function() {
        console.log("Unhandled invoked.");
        var speechOutput = "I didn't understand what you meant.";
        this.emit(':tell', speechOutput);
    }
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      var updatedIntent=this.event.request.intent;
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}
