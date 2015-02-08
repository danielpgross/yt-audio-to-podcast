// Test youtube API access outside of a server context

var ytAudioToPodcast = require('./youtube-audio-to-podcast.js');

var channelUsername = process.argv[2];
console.log('Creating podcast RSS for '+channelUsername);

ytAudioToPodcast.getChannelIdByUsername(channelUsername, function(err, list) {
	var channelId = list.items[0].id;
	console.log('Channel ID: '+channelId);
});

