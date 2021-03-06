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
		socket.emit('stop_stream');
	}

	// On submit, send list of terms to server
	$('#search-form').on('submit', function(e){
		e.preventDefault();

		// if no terms are being sent, return false
		if ($('#s').val() == '') return false;

		if ($('#search-form :submit').hasClass('btn-success')){

			// Send terms to socket
			emitTerms();

			//disable #s
			$('#s').attr('disabled','disabled');

			//display pulsating icon
			$("#pulsating-icon").css('display', 'block');

			// toggle classes
			$('#search-form :submit').toggleClass('btn-success btn-danger');
			$('#search-form :submit span').toggleClass('glyphicon-play glyphicon-stop');			

	} else if ($('#search-form :submit').hasClass('btn-danger')){
			
			// Emit disconnect
			emitDisconnect();
			
			//enable #s
			$('#s').removeAttr('disabled');

			//hide pulsating icon
			$("#pulsating-icon").css('display', 'none');

			// toggle classes
			$('#search-form :submit').toggleClass('btn-danger btn-success');
			$('#search-form :submit span').toggleClass('glyphicon-stop glyphicon-play');

		}
		

	});
	
	socket
	.on('tweet', function (data) {
		// console.log(data.text);
		var coordinates = data.coordinates.coordinates;

		L.marker([coordinates[1], coordinates[0]]).addTo(T.map)
		.bindPopup('<a href="https://twitter.com/' + data.user.screenname +'/status/' + data.id_str + '" target="_blank">' + data.text + '</a>')
		.openPopup();
	})
	.on('disconnect', function(){
			// Display a warning message
		});

	T.socket = socket;

})(jQuery, T);