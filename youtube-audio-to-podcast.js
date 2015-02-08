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
	}, cb);
}