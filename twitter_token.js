'use strict';

var Twitter = require('node-twitter-api');
var prompt = require('prompt-promise');
const opn = require('opn');

var twitter;

prompt('api key: ')
  .then(function(apiKey){
    return prompt('api secret: ')
      .then(function(apiSecret){
        twitter = new Twitter({
          consumerKey: apiKey,
          consumerSecret: apiSecret,
          callback: ''
        });

        return {apiKey:apiKey, apiSecret:apiSecret};
      })
  })
  .then(function(settings){
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
      if (!error) {
        opn(twitter.getAuthUrl(requestToken), { wait: false });

        console.log(`Your browser should now open an authorization request page for Twitter.`);
        console.log(`Click the "Authorize App" button and then copy and paste the PIN it gives you to below:`);

        prompt('pin: ')
          .then(function(pin){
            twitter.getAccessToken(requestToken, requestTokenSecret, pin, function(error, accessToken, accessTokenSecret, results) {
              if (!error) {
                var info = {
                  "twitter": {
                    "api_key" : settings.apiKey,
                    "api_secret": settings.apiSecret,
                    "access_token": accessToken,
                    "access_token_secret": accessTokenSecret
                  }
                }

                console.log(info);
                prompt.done();
              } else {
                console.log(error);
                prompt.finish();
              }
            });
          })
      } else {
        console.log(error);
        prompt.finish();
      }
    });
  });
