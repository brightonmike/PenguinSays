var Twit = require('twit')
var base64 = require('node-base64-image');

var T = new Twit({
    consumer_key:         ''
  , consumer_secret:      ''
  , access_token:         ''
  , access_token_secret:  ''
})

var stream = T.stream('statuses/filter', { track: ['#PenguinSays', '#penguinsays', '#penguinSays'] })

var jokes = ["What do Penguins eat for lunch? Icebergers.", "How does a penguin build its house? Igloos it together.", "What's black and white and red all over? A penguin in a blender.", "Why do Penguins carry fish in their beaks? Because they haven't got any pockets.", "What do you get when you cross a penguin and an alligator? I don't know, but don't try to fix its bow tie.", "Why don´t you see penguins in Britain? Because they're afraid of Wales.", "What's black and white and goes round and around? A Penguin in a revolving door.", "What's black and white and has eight wheels? A penguin on roller skates.", "Why don't Polar Bears eat Penguins? They can't get the wrappers off.", "What do you call a penguin in the desert? Lost."];

stream.on('tweet', function (tweet) {
	console.log("Recieved - " + tweet.user.screen_name)  
  randomGif(tweet)
})

function randomGif(tweet) {
	q = "penguin animal"; // search query
  
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xmlrequest = new XMLHttpRequest();
	
	xmlrequest.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+q, true);
	
	xmlrequest.onload = function() {
		if (xmlrequest.status >= 200 && xmlrequest.status < 400){
			var image_url = JSON.parse(xmlrequest.responseText).data.image_url;
			var options = {string: true};
			var base64 = require('node-base64-image');
			
			base64.base64encoder(image_url, options, function (err, image) {
		    if (err) {
		        console.log(err);
		    }
			
				T.post('media/upload', { media_data: image }, function (err, data, response) {
					
					var randJoke = jokes[getRandomInt(0, jokes.length)];
				
				  // now we can reference the media and post a tweet (media will attach to the tweet)
				  var mediaIdStr = data.media_id_string
				  var params = { status: "@" + tweet.user.screen_name + " - " + randJoke + ". You're welcome.", in_reply_to_status_id: tweet.id_str, media_ids: [mediaIdStr] }
				
				  T.post('statuses/update', params, function (err, data, response) {					  
					  console.log("SENT - " + tweet.user.screen_name)
				  })
				})
			});  
		}
	};

	xmlrequest.onerror = function() {
		console.log('connection error');
	};

	xmlrequest.send();
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}