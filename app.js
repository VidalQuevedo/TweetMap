
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
 var twit = new (require('twit'))(config.twit);
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

		// Enable sockets to start exchanging data with front end
		io.sockets.on('connection', function (socket) {

			// The 'terms' event is triggered by 
			// the client on connect
			socket.on('terms', function(data){

				console.log('Terms received:');
				console.log(data.terms);

				// Start collecting Tweets with terms
				var stream = twit.stream('statuses/filter', {
					track: data.terms,
					language:"en"
				});

				stream
					.on('tweet', function(tweet){
						
						// broadcast
						if(tweet.coordinates !== null){
							console.log(tweet.text);
							io.sockets.emit('tweet',tweet);
						}
						
						// Optional
						// db.collection('tweets').insert(tweet, function(err, doc){
						// 	if (err) throw err;
						// 	// console.log(doc);
						// });
					})
					.on('limit', function(limitMessage){
						console.log(limitMessage);
						
						// stop stream
						this.stop();

						// disconnect socket
						socket.emit('disconnect');
						
						return false;
					})
					.on('disconnect', function(disconnectMessage){
						console.log(disconnectMessage);
						
						// disconnect socket
						socket.emit('disconnect');
						
						return false;
					});
			});

		});

		// Create HTTP server
		http.createServer(app).listen(config.port, function(){
			console.log('Express server listening on port ' + config.port);
		});

	}
});