var m = module.exports = {};

m.getPodcastItemsByChannelId = function(channelId, enclosureUrlTpl, cb) {
	var google = require('googleapis');
	var config = require('nodejs-config')(
		__dirname
	);
	var _ = require('underscore');
	var yt = google.youtube('v3');

	yt.search.list({
		part: 'id,snippet',
		channelId: channelId,
		key: config.get('local.youtubeApiKey'),
		maxResults: 50,
		order: 'date', // descending date order is important for a podcast
		type: 'video',
	}, function(err, list) {
		// Pull out the relevant items for our podcast RSS
		var items = list.items;

		// Map into our desired format
		items = _.map(items, function(item) {
			return {
				title: item.snippet.title,
				description: item.snippet.description,
				url: 'http://youtu.be/'+item.id.videoId,
				date: item.snippet.publishedAt,
				enclosure: {
					url: enclosureUrlTpl.replace('[videoId]', item.id.videoId),
					type: 'audio/mpeg',
				}
			};
		});

		cb(items);
	});
}

m.getChannelInfoByUsername = function(username, feedUrl, cb) {
	var google = require('googleapis');
	var config = require('nodejs-config')(
		__dirname
	);
	var yt = google.youtube('v3');

	return yt.channels.list({
		part: 'id,snippet',
		forUsername: username,
		key: config.get('local.youtubeApiKey')
	}, function(err, list) {
		var channel = list.items[0];
		var ret = {};

		if (!channel) return;

		ret[channel.id] = {
			title: channel.snippet.title,
			description: channel.snippet.description,
			feed_url: feedUrl,
			site_url: "http://youtube.com/channel/"+channel.id,
			image_url: channel.snippet.thumbnails.default.url,
		};
		cb(ret);
	});
}

m.getPodcastRssXml = function(info, items) {
	var rss = require('rss');
	var _ = require('underscore');

	var feed = new rss(info);
	_.each(items, function(item) {
		feed.item(item);
	});

	return feed.xml();
}

m.getPodcastRssXmlByUsername = function(username, feedUrl, enclosureUrlTpl, cb) {
	m.getChannelInfoByUsername(username, feedUrl, function(info) {
		// Get the channel id
		for (var channelId in info) { continue; }

		m.getPodcastItemsByChannelId(channelId, enclosureUrlTpl, function(items) {
			cb(m.getPodcastRssXml(info[channelId], items));
		});
	});
}

m.getAudioStreamByVideoId = function(videoId, outputStream) {
	var ytdl = require('ytdl-core');
	var ffmpeg = require('fluent-ffmpeg');

	var vidUrl = 'http://www.youtube.com/watch?v='+videoId;
	var videoStream = ytdl(vidUrl, {filter: 'audioonly'});

	return ffmpeg().input(videoStream).format('mp3').pipe();
}