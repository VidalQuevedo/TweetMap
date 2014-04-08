// Init global object T
var T = {};


// Map
(function($, T){

	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([43.0667, -89.4000], 13);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker([43.0667, -89.4000]).addTo(map)
	.bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
	.openPopup();

	T.map = map;

})(jQuery,T);