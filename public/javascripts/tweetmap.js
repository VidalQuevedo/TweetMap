// Init global object T
var T = {};

// Map
(function($, T){

	var cmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	cmAttr = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	minimal = L.tileLayer(cmUrl, {
		styleId: 999,
		attribution: cmAttr
	});

	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map', {
		center: [43.0667, -89.4000],
		zoom: 2,
		layers: minimal
	});
	
	if (typeof(map) !== 'undefined') {
		$('#map').css('height',$(window).height());
	}

	T.map = map;

})(jQuery,T);


// Socket

(function($, T){

	var socket = io.connect('http://localhost:8080');

	var emitTerms = function(){
		var terms = $('#s').val().split(',');
		socket.emit('terms', {'terms':terms});
	};

	var emitDisconnect = function(){
		socket.emit('disconnect');
	}

	// On submit, send list of terms to server
	$('#search-form').on('submit', function(e){
		e.preventDefault();
		if ($('#search-form :submit').hasClass('btn-success')){
			// Send terms to socket
			emitTerms();
		} else if ($('#search-form :submit').hasClass('btn-danger')){
			// Emit disconnect
			//emitDisconnect();
		}
		
		// Set #s class to btn-alert
		$('#search-form :submit').toggleClass('btn-danger');
	});
	
	socket
	.on('tweet', function (data) {
		console.log(data.text);
		var coordinates = data.coordinates.coordinates;

		L.marker([coordinates[1], coordinates[0]]).addTo(T.map)
		.bindPopup(data.text)
		.openPopup();
	})
	.on('disconnect', function(){
			// Display a warning message
		});

	T.socket = socket;

})(jQuery, T);