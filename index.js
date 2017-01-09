var colors = require('colors');
var Flickr = require('flickr-sdk');
var fs = require('fs');
var lyricPaper = require('lyric-paper');
var Promise = require('promise');
var Twitter = require('twitter');
const delay = require('delay');

var settings = JSON.parse(fs.readFileSync('settings.json'));

var flickr = new Flickr({
  apiKey: settings.flickr.api_key,
  apiSecret: settings.flickr.api_secret,
  accessToken: settings.flickr.access_token,
  accessTokenSecret: settings.flickr.access_token_secret
});

var twitClient = new Twitter({
  consumer_key: settings.twitter.api_key,
  consumer_secret: settings.twitter.api_secret,
  access_token_key: settings.twitter.access_token,
  access_token_secret: settings.twitter.access_token_secret
});

function generateImage() {
  return new Promise(function(fulfill, reject){
    var imgSettings = {
      file: 'image.png',
      flickr_api_key: settings.flickr.api_key,
      flickr_api_secret: settings.flickr.api_secret
    };

    imgSettings = Object.assign({}, settings, imgSettings);

    lyricPaper(imgSettings, function(err, res) {
      if (!err) {
        fulfill(res);
      } else { reject(err); }
    });
  });
}

function uploadImage(imgInfo) {
  if (!settings.mute) { console.log(`Uploading image...`.dim); }
  return new Promise(function(fulfill, reject){
    flickr
      .request(settings.flickr.access_token, settings.flickr.access_token_secret)
      .media()
      .post({'photo': './image.png'})
      .then(function(response) {
        flickr
          .request()
          .media(response.body.photoID)
          .get()
          .then(function(response) {
             fulfill(response.body.photo);
          }, function(error) {
            reject(error);
          });
      }, function(error) {
        reject(error);
      });
  });
}

function getImgUrl(i) {
  return `https://farm${i.farm}.staticflickr.com/${i.server}/${i.id}_${i.originalsecret}_o.${i.originalformat}`;
}

if (!settings.mute) { console.log(`Lyrcper by Kodie Grantham [www.kodieg.com]`.green.bold); }

generateImage()
  .then(delay(5000)) // Wait 5 seconds before trying to upload the image to make sure it's ready. @TODO: Find a better way...
  .then(function(r){
    return uploadImage(r)
      .then(function(i){
        r.image.url = getImgUrl(i);
        if (!settings.mute) { console.log(`Image URL: ${r.image.url}`.bold); }
        return r;
      });
  })
  .then(function(r){
    if (!settings.mute) { console.log(`Posting to Twitter...`.dim); }

    var text = r.song.line;
    if (text.length > 116) { text = text.substr(0, (116 - 3)) + '...'; }
    text = text + ' ' + r.image.url;

    return twitClient.post('statuses/update', {status: text})
      .then(function(tweet){
        if (!settings.mute) {
          console.log(`Tweet posted: ${tweet.text}`.bold);
          console.log('Done!'.rainbow);
        }
        return Promise.resolve();
      })
      .catch(function(e){
        return Promise.reject(e[0].message);
      })
  })
  .catch(function(e){
    if (!settings.mute) { console.log(new Error(e)); }
  });
