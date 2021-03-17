var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  // Create a baseMaps object to hold the lightmap layer
// d3.json(queryUrl, function(response) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   console.log(response)
//   var quakes = response.features
//   console.log(quakes)

//   for (var i= 0; i < quakes.length; i++) {
//     var magnitude = quakes[i].properties.mag;
//     //console.log(magnitude)
//     var lon = quakes[i].geometry.coordinates[1];
//     console.log(lon)    
//   }
// });

function createMap(rumblies) {
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": rumblies
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, rumblies]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  var legend = L.control({position: 'bottomright'});

  function getColor(d) {
      return d > 120 ? '#800026' :
             d > 90  ? '#BD0026' :
             d > 60  ? '#E31A1C' :
             d > 30  ? '#FC4E2A' :
             d > 15   ? '#FD8D3C' :
             d > 10   ? '#FEB24C' :
             d > 5   ? '#FED976' :
                        '#FFEDA0';
  }  
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 5, 10, 15, 30, 60, 90, 120],
        labels = ['<strong>Erthquake Depth</strong><br>']
        div.innerHTML+=labels

    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);

}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var earthquakes = response.features;
  console.log(earthquakes)
  console.log()
  // Initialize an array to hold bike markers
  var quakemarkers = [];

  // Loop through the stations array
  for (var index = 0; index < earthquakes.length; index++) {
    var quake = earthquakes[index];
	function getColor(d) {
	    return d > 120 ? '#800026' :
	           d > 90  ? '#BD0026' :
	           d > 60  ? '#E31A1C' :
	           d > 30  ? '#FC4E2A' :
	           d > 15   ? '#FD8D3C' :
	           d > 10   ? '#FEB24C' :
	           d > 5   ? '#FED976' :
	                      '#FFEDA0';
	}    
    // For each station, create a marker and bind a popup with the station's name
    // var quakemarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
    //   .bindPopup("<h3>Magnitude:" + quake.properties.mag + "<h3><h3>Depth: " + quake.geometry.coordinates[2] + "</h3>");
	var quakemarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
	    color: 'white',
	    fillColor: getColor(quake.geometry.coordinates[2]),
	    // fillColorscale: 'red',
	    fillOpacity: 0.5,
	    radius: (quake.properties.mag*10000)
	}); 
	quakemarker.bindPopup("<h3>Name:" + quake.properties.title + "<h3><h3>Time: " + quake.properties.time + "</h3><h3>Magnitude: " + quake.properties.mag + "</h3>");   
    // Add the marker to the bikeMarkers array
    quakemarkers.push(quakemarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(quakemarkers));
}



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);