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
		zoom: 13,
		layers: minimal
	});

	
	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker([43.0667, -89.4000]).addTo(map)
	.bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
	.openPopup();



	T.map = map;

})(jQuery,T);