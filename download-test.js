// Test video download and conversion to audio, outside of a server context
var fs = require('fs');
var ytdl = require('ytdl-core');
 
ytdl('https://www.youtube.com/watch?v=suY1sUYEERc', {filter: 'audioonly'})
  .pipe(fs.createWriteStream('audio.mp3'));