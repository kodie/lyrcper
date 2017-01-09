# [@lyrcper](https://twitter.com/lyrcper)

A Twitter bot that posts randomly generated wallpapers with song lyrics.

## Installation
1. Clone this repository.
2. `cd lyrcper`
3. `npm install`
4. `cp settings-example.json settings.json`
5. Open up `settings.json` in your favorite text editor and fill in your API credentials for [Musixmatch](https://www.musixmatch.com), [Flickr](https://www.flickr.com), and [Twitter](https://twitter.com).

### How to get Musixmatch API credentials
1. Create a free Musixmatch account here: https://developer.musixmatch.com/signup
2. Go to the account verification link that they sent to your e-mail and log in to your new account.
3. Go to the applications section of your dashboard here: https://developer.musixmatch.com/admin/applications

Your API key will be in the center column, next to "(Your Username)'s App".

### How to get Flickr API credentials

#### API key/secret
1. Create a free Flickr account here: https://www.flickr.com
2. Log into your account and create a new Flickr app here: https://www.flickr.com/services/apps/create/noncommercial/

Your API key and secret will be displayed after creating the app.

#### Access token/secret
1. `cd` into the directory where you cloned the lyrcper repository.
2. `npm install prompt-promise opn`
3. `node flickr_token.js`
4. Follow the on-screen directions.

Your access token and secret will then be displayed.

### How to get Twitter API credentials

#### API key/secret
1. Create a free Twitter account here: https://twitter.com/signup
2. Log into your account and create a new Twitter app here: https://apps.twitter.com/app/new (Leave the callback URL blank)
3. On the next page, click on the "Keys and Access Tokens" tab.

Your API key and secret will then be displayed.

#### Access token/secret
1. `cd` into the directory where you cloned the lyrcper repository.
2. `npm install node-twitter-api prompt-promise opn`
3. `node twitter_token.js`
4. Follow the on-screen directions.

Your access token and secret will then be displayed.

## Settings
lyrcper uses the [lyric-paper](https://github.com/kodie/lyric-paper) module to generate the wallpapers, therefore you can use any options that it uses as everything inside of `settings.json` is passed straight to it.

See https://github.com/kodie/lyric-paper#options for a list of options that you can set.

## License
MIT. See the License file for more info.
