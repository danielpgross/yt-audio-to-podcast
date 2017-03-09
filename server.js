var config = require('nodejs-config')(
	__dirname
);
var ytAudioToPodcast = require('./youtube-audio-to-podcast.js');

var http = require("http");
var server = http.createServer(function(request, response) {
	// Parse out the YT channel name
	// Format : /[YouTube channel name]/feed.xml
	var urlParts = request.url.split('/');
	var channel = urlParts[1];
	var filename = urlParts[2];
	var mp3FileMatch = (filename || '').match(/(.*)\.mp3$/);

	if (filename == 'feed.xml' || filename == 'user.xml') {
		response.writeHead(200, {"Content-Type": "application/rss+xml"});

		ytAudioToPodcast.getPodcastRssXmlByUsername(
			channel, 
			request.url,
			'http://'+request.headers.host+'/'+channel+'/[videoId].mp3',
			function(xml) {
				response.write(xml);
				response.end();
			}
		);
	} else if (filename == 'channel.xml') {
		response.writeHead(200, {"Content-Type": "application/rss+xml"});

		ytAudioToPodcast.getPodcastRssXmlByChannelId(
			channel, 
			request.url,
			'http://'+request.headers.host+'/'+channel+'/[videoId].mp3',
			function(xml) {
				response.write(xml);
				response.end();
			}
		);
	} else if (mp3FileMatch) {
		response.writeHead(200, {
			"Content-Type": "audio/mpeg", 
			'Transfer-Encoding':'chunked', 
			'connection': 'keep-alive',
			'Content-Transfer-Encoding': 'binary',
		});
		var videoId = mp3FileMatch[1];

		var audioStream = ytAudioToPodcast.getAudioStreamByVideoId(videoId);
		audioStream.pipe(response);
	} else {
		response.writeHead(404);
		response.write('Invalid request');
		response.end();
	}
});

var port = config.get('local.port');
server.listen(port);
console.log("Listening on "+port);
