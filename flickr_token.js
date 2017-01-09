'use strict';

var Flickr = require('flickr-sdk');
var prompt = require('prompt-promise');
const opn = require('opn');

var flickr;

prompt('api key: ')
  .then(function(apiKey){
    return prompt('api secret: ')
      .then(function(apiSecret){
        flickr = new Flickr({
          apiKey: apiKey,
          apiSecret: apiSecret,
        });

        return {apiKey:apiKey, apiSecret:apiSecret};
      })
  })
  .then(function(settings){
    flickr
      .request()
      .authentication()
      .prepareRequestToken('https://www.flickr.com/')
      .then(function(data) {
        opn(data.authorizationURL, { wait: false });

        console.log(`Your browser should now open an authorization request page for Flickr.`);
        console.log(`Click the "OK, I'LL AUTHORIZE IT" button and then copy and paste the URL it redirects you to below:`);

        return data;
      })
      .then(function(data){
        return prompt('url: ')
          .then(function(r){
            data.redirectUrl = r;
            return data;
          })
      })
      .then(function(data){
        var vals = [];
        var i = 0;
        var url = data.redirectUrl;
        var urlSplit = url.split('?');
        urlSplit = urlSplit[1].split('&');

        for (i = 0; i < urlSplit.length; i++) {
          var thisParam = urlSplit[i].split('=');
          vals.push(thisParam[1]);
        }

        data.request_token = vals[0];
        data.oauth_verifier = vals[1];

        return data;
      })
      .then(function(data){
        return flickr
          .request()
          .authentication()
          .authenticateUser(data.request_token, data.oauth_token_secret, data.oauth_verifier);
      })
      .then(function(data){
        var info = {
          "flickr": {
            "api_key": settings.apiKey,
            "api_secret": settings.apiSecret,
            "access_token": data.oauth_token,
            "access_token_secret": data.oauth_token_secret,
            "user_id": data.user_nsid
          }
        }

        console.log(info);
        process.exit();
      });
  });
