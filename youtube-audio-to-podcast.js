var m = module.exports = {};

m.getChannelIdByUsername = function(username, cb) {
	var google = require('googleapis');
	var config = require('nodejs-config')(
		__dirname
	);

	var yt = google.youtube('v3');
	return yt.channels.list({
		part: 'id',
		forUsername: username,
		key: config.get('local.youtubeApiKey')
	}, function(err, list) {
		cb(list.items[0].id);
	});
}

m.getPodcastItemsByChannelId = function(channelId, cb) {
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
		orderBy: 'date', // descending date order is important for a podcast
		type: 'video',
	}, function(err, list) {
		// Pull out the relevant items for our podcast RSS
		var items = list.items;

		// Map into our desired format
		items = _.map(items, function(item) {
			return {
				title: item.snippet.title,
				desc: item.snippet.description,
				url: 'http://youtu.be/'+item.id.videoId,
				date: item.snippet.publishedAt,
			};
		});
		// Sort by date desc
		items = _.sortBy(items, function(item) {
			return item.date;
		}).reverse();

		cb(items);
	});
}