# TweetMap.js

A NodeJS app to display tweets on a map.


## Usage 

Assuming node and mongodb are installed:

### Create Twitter app and get credentials
1. Go to [http://dev.twitter.com](http://dev.twitter.com) and register your app

### Download/clone this repo
1. Download this repo
2. `cd tweetmap/`
3. `npm install`
4. Create a config.js file from config.sample.js
5. Fill in `twit` credentials (consumer_key, consumer_secret,access_token, and access_token_secret)

### Fire up Mongo

1. Start `mongod` server

### Run app
3. `node app.js`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

