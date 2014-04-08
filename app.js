
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
 var io = require('socket.io').listen(8080);

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

		// enable socket io to act on connect
		io.sockets.on('connection', function (socket) {

			socket.on('terms', function(msg){
				console.log(msg);
			});
			// retrieve 
			//start or reset Twit
			// socket.emit('news', { hello: 'world' });
			// socket.on('my other event', function (data) {
			// 	console.log(data);
			// });
		});

		// Start collecting Tweets
		// T = new Twit(config.twit);
		// var stream = T.stream('statuses/filter', {
		// 	track: ["cat", "cats", "kitty", "kitten", "kittens"],
		// 	language:"en"
		// });
		// stream.on('tweet', function(tweet){
		// 	console.log(tweet.text);
		// 	if(tweet.coordinates !== null && tweet.entities.media){
		// 		// broadcast
		// 		io.sockets.emit('tweet',tweet);
		// 	}
			// db.collection('tweets').insert(tweet, function(err, doc){
			// 	if (err) throw err;
			// 	// console.log(doc);
			// });
	// });


		// Create HTTP server
		http.createServer(app).listen(config.port, function(){
			console.log('Express server listening on port ' + config.port);
		});

		// Sockets
		// io.sockets.on('connection', function (socket) {
		// 	socket.emit('news', { hello: 'world' });
		// 	socket.on('my other event', function (data) {
		// 		console.log(data);
		// 	});
		// });		
	}
});