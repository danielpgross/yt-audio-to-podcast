// Test youtube API access outside of a server context

var ytAudioToPodcast = require('./youtube-audio-to-podcast.js');

var channelUsername = process.argv[2];
console.log('Creating podcast RSS for '+channelUsername);

ytAudioToPodcast.getChannelIdByUsername(channelUsername, function(channelId) {
	console.log('Channel ID: '+channelId);

	ytAudioToPodcast.getPodcastItemsByChannelId(channelId, function(items) {
		console.log("Feed items: \n"+JSON.stringify(items, null, 2));

		ytAudioToPodcast.getChannelInfoByChannelId(channelId, function(info) {
			console.log('Channel info :'+JSON.stringify(info, null, 2));
		});
	});
});