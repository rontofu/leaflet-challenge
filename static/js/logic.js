// Create map object
var myMap = L.map("map", {
    center: [11.070023667194343, 20.286285997685294],
    zoom: 2
});


// Add tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// Use link to get json geodata
var geoData_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var geojson;


// Grab data with d3
d3.json(geoData_url).then(function (data) {
    console.log(data)

    var geojsonMarkerOptions = {
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.8
    };

    geojson = L.geoJson(data, {

        style: function (feature) {
            return {
                color: "black",
                radius: chooseRadius(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.8,
                weight: 0.5,
                opacity: 0.5
            };
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        onEachFeature: function (feature, layer) {
            layer.on({
                    mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                    mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.8
                    });
                },
            });
            // Give each feature a pop-up with info
            layer.bindPopup("<h1>" + feature.properties.title + "</h1><h5>Time " + new Date(feature.properties.time) + "</h5>");

        }
    }).addTo(myMap);


    // Add legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            range = [0,1, 2, 3, 4, 5],
            labels = [];
        
        for (var i = 0; i < range.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(range[i] + 1) + '"></i> ' +
                range[i] + (range[i + 1] ? '&ndash;' + range[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

});


// Choose radius size based on magnitude
function chooseRadius(magnitude) {
    if (magnitude < 1) {
        return 4;
    }
    else if (magnitude >= 1 && magnitude < 2) {
        return 6;
    }
    else if (magnitude >= 2 && magnitude < 3) {
        return 8;
    }
    else if (magnitude >= 3 && magnitude < 4) {
        return 10;
    }
    else if (magnitude >= 4 && magnitude < 5) {
        return 12;
    }
    else {
        return 16;
    }
}


// Choose colours for each magnitude
function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#7bff2f";
    }
    else if (magnitude >= 1 && magnitude < 2) {
        return "#f7ea74";
    }
    else if (magnitude >= 2 && magnitude < 3) {
        return "#ffd500";
    }
    else if (magnitude >= 3 && magnitude < 4) {
        return "#ff9d00";
    }
    else if (magnitude >= 4 && magnitude < 5) {
        return "#ff002b";
    }
    else {
        return "#7a0101";
    }
}

// Choose colours for the legend
function getColor(d) {
    return d <= 1 ? '#7bff2f' :
           d <= 2  ? '#f7ea74' :
           d <= 3  ? '#ffd500' :
           d <= 4  ? '#ff9d00' :
           d <= 5   ? '#ff002b' : '#7a0101';
}