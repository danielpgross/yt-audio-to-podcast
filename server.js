var config = require('nodejs-config')(
	__dirname
);
var ytAudioToPodcast = require('./youtube-audio-to-podcast.js');

var http = require("http");
var server = http.createServer(function(request, response) {
	// Parse out the YT channel name
	// Format : /[YouTube channel name]/feed.xml
	var username = request.url.split('/')[1];
	if (!username) {
		response.writeHead(404);
	} else {
		response.writeHead(200, {"Content-Type": "application/rss+xml"});

		ytAudioToPodcast.getPodcastRssXmlByUsername(
			username, 
			request.url,
			'http://'+request.headers.host+'/'+username+'/[videoId].mp3',
			function(xml) {
				response.write(xml);
				response.end();
			}
		);
	}
});

var port = config.get('local.port');
server.listen(port);
console.log("Listening on "+port);