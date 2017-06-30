# DogDays
This is the source for my Dog Days Alexa Skill.  My applicaiton was accepted into the Alexa Skills store on 6/29/2017 and is
live as of this writing (6/30/2017).  A goal of sharing this source is to assist others with the development of their Alexa 
Skills as well.  This particular code base borrows heavily from the plan my trip application with a few nuances.  For
instance, the grammar supports synonyms (in this case you can say "tiny" and it gets interpreted as "dog").  I have left in
the intent response to show where the synonym maps into the actual slot value because that was difficult to find in the
literature.  Also, there is some error checking on date ranges to deal with dates after the present in case someone was 
misinterpreted as giving a dog age ahead of today.  This became easier by using the MomentJS framework for date keeping 
because it was better suited than the built-in Date javascript object.  I have used straight text-to-speech rather than
using SSML and the skill currently only supports US English, although there are guides to expanding the application into
other languages (I speak a little Spanish and some Dutch so maybe those might be the next two entries?).

# Installing Code
The code was developed on a Mac and uploaded to Amazon's Lambda service and Alexa speech development site.  npm install will 
install the support libraries and a "f.sh" script simply zips up the local files in preparation for upload.  The grammar
supports synonyms which can be expanded; the grammar must be cut-and-pasted into the Alexa Speech Development site rather than
entered in individually since the current GUI does not support synonyms.

# Tests subfolder
I added these from the planMyTrip example but I haven't yet updated them for DogDays since I did my testing interactively.
A full regression tester would be a nice enhancement under Room For Improvement especially since the data sets are minimal.

# Room For Improvement
The date values can be better cleaned up for boundary cases such as "Today", "Tomorrow", etc.  An utterance on 6/29 yielded
"2017-W27" from the speech object so we should add some better error checking for bad items from the grammar.  It would be 
nice to have a "Do you have another dog to try" dialog as well for households with multiple dogs.  The grammar supported your
saying "stupid" and that being accepted as a slot value.  I haven't checked to see what actual slot value was for that, but
that seems incorrect and should force you into a retry dialog.  Same for invalid dates.  Finally, a potential expansion would
involve your putting your own birthdate or date of dog purchase/acquisition and determining when you and the dog are the same
age or when you have lived with the dog longer than not having lived with the dog.  Because of the piecewise linearity of the
dog chart, we can use some basic geometry to see when dates cross over but it is a non-trivial task; still it would certainly
distinguish Dog Days from other applications in the field and it would be a straightforward expansion.  Adding calendaring
to remind you when your "cross-over" date is could be good for promotion value and provide an opportunity to reach out to
pet stores for advertising.  The images are hosted in my S3 account so I don't know if there will ever be an issue with number
of hits should this application become popular.  I should probably inform users to check the mobile application for hard
copies of the results (perhaps formatting the dates to be more localized).  The mobile app card/web card could be used for
adding advertising as well.


