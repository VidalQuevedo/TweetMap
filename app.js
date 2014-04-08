
/**
 * Module dependencies.
 */

 var express = require('express');
 var routes = require('./routes');
 var config = require('./config.js')();
 var http = require('http');
 var path = require('path');
 var hbs = require('hbs');
 var MongoClient = require('mongodb').MongoClient;
 var Twit = require('twit');

 var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine ('html', hbs.__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);


// Connect to MongoDB and start up HTTP server

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, function(err, db){

	if (err) { 
		console.log("Couldn't connect to database. Please check your configuration in config.js (" + err + ")");
	} else {

		// Start collecting Tweets
		T = new Twit(config.twit);
		var stream = T.stream('statuses/sample');
		console.log('Collecting tweets...');
		stream.on('tweet', function(tweet){
			// console.log(tweet);
			db.collection('tweets').insert(tweet, function(err, doc){
				if (err) throw err;
				// console.log(doc);
			});
		});

		// Create HTTP server
		http.createServer(app).listen(config.port, function(){
			console.log('Express server listening on port ' + config.port);
		});
	}
});