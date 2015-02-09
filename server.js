var config = require('nodejs-config')(
	__dirname
);
var ytAudioToPodcast = require('./youtube-audio-to-podcast.js');

var http = require("http");
var server = http.createServer(function(request, response) {
	// Parse out the YT channel name
	// Format : /[YouTube channel name]/feed.xml
	var urlParts = request.url.split('/');
	var username = urlParts[1];
	var filename = urlParts[2];
	var mp3FileMatch = (filename || '').match(/(.*)\.mp3$/);

	if (!username && !filename) {
		response.writeHead(404);
	} else if (filename == 'feed.xml') {
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
	} else if (mp3FileMatch) {
		response.writeHead(200, {
			"Content-Type": "application/octet-stream", 
			'Transfer-Encoding':'chunked', 
			'connection': 'keep-alive',
			'Content-Disposition': 'attachment; filename="download.mp3"',
			'Content-Transfer-Encoding': 'binary',
		});
		var videoId = mp3FileMatch[1];

		var audioStream = ytAudioToPodcast.pipeAudioStreamByVideoId(videoId);
		audioStream.pipe(response);
	}
});

var port = config.get('local.port');
server.listen(port);
console.log("Listening on "+port);