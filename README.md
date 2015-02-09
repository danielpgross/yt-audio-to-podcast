# yt-audio-to-podcast
Host YouTube channel feeds as podcasts, with streaming video-to-audio conversion.

## Installation and usage

### Requirements
- `node`, `npm`
- FFmpeg (development has been done against FFmpeg 2.2)

### Starting the server
```sh
$ git clone https://github.com/danielpgross/yt-audio-to-podcast
$ cd yt-audio-to-podcast
$ nano config/local.json # See configuration section below
$ node server.js
```

### Subscribing to podcasts
Once the server is running, you should be able to subscribe to podcasts using any podcast client through feed URLs following the pattern `http://[YOUR HOSTNAME]/[YOUTUBE USERNAME]/feed.xml`. This feed file is generated on demand using the YouTube username passed in the URL.

For example, to subscribe to an audio-only feed for the White House YouTube channel, use `http://localhost/whitehouse/feed.xml`

#### A note on podcast downloading behaviour
Since podcasts are streamed directly to the client without saving temporary files on the server (see "How it works" below), the server is uncertain of the filesize when initiating file transfers and does not tell the client how large a file to expect. As a result, the client is unable to estimate download progress and completion time. Practically, this means that most clients will show an "uncertain" progress bar and the download might not appear to be working. This behaviour is normal and the download will eventually complete.

#### A note on the iOS podcast client
The iOS Podcasts app can subscribe to any podcast URL, it is not limited to podcasts from the iTunes store. See http://www.cnet.com/how-to/add-any-podcast-to-the-ios-podcasts-app/ for instructions on how to do so.

## Configuration
The app requires a YouTube API key in order to query channel videos. An API key can be obtained for free using a regular Google account at https://developers.google.com/youtube/registering_an_application.

Edit `config/local.json` to enter your API key and to choose a port for the server to run on.

## How it works
### `feed.xml`
When the feed file is requested, the app queries the YouTube API for the list of videos on the requested channel. This list is used to generate a podcast-format RSS file, with file download URLs linking back to the server.

### `[videoId].mp3`
When the podcast client requests an MP3 file for an episode, the server downloads the video, transcodes it on the fly to audio only, and streams it to the client. Using this approach, no extra storage space is needed on the server for storing episodes.