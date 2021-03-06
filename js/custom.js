// Map components and initialization for use on web page
$(document).ready(function() {

    // Mapbox variables
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'; // Attribution for copyright/fair-use


    // Layers
    var light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});


    // Map initialization
    var map = L.map('mainMap', {
        center: [22, -97],
        zoom: 3.6,
        maxZoom: 7,
        fullscreenControl: true,
        layers: [light]
    });
    
    map.dragging.disable();
    map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	map.removeControl(map.zoomControl);
	map.removeControl(map.fullscreenControl);

    // Declaration of global variables for functions below
    var geojson;

    // Color states/counties differently if needed (based on property called "section" in statesData)
    function getColor(sec) {
        return sec == 1 ? '#00396a' :
        sec == 2  ? '#58595b' :
        'transparent';
    }


    // Add style properties to layer elements
    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: '#f4f4f4',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.section)
        };
    }


    // Add definition, border, and popup highlight to layer selected
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
                weight: 3,
                color: '#f4f4f4',
                fillColor: '#ad132a',
                dashArray: '',
                fillOpacity: 0.7
            
        });
        
        var latlng = L.latLng(layer.feature.properties.center);

        var popup = L.popup()
        .setLatLng(latlng)
        .setContent('<span><em><strong>' + layer.feature.properties.name + '</strong></em></span>')
        .openOn(map);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    // Add Popup to other layer selected
    function highlightFeatureOther(e) {
        var layer = e.target;

        //set highlight color for other layer
        // layer.setStyle({
        //     weight: 3,
        //     color: '#f4f4f4',
        //     fillColor: '#ad132a',
        //     dashArray: '',
        //     fillOpacity: 0.7
        // });

        var latlng = L.latLng(layer.feature.properties.center);

        var popup = L.popup()
        .setLatLng(latlng)
        .setContent('<span><em><strong>' + layer.feature.properties.name + '</strong></em></span>')
        .openOn(map);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    // Reset highlight
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    // Bring all the functions together
    function onEachFeature(feature, layer) {
        //calls if layer is 1
        if(feature.properties.section == 1){
            layer.on({
                // function called when pointer hovers on a state(layer)
                mouseover: highlightFeature,
                // function called when pointer leaves a state(layer)
                mouseout: resetHighlight,
            });
        }
        //calls if layer is 2
        if(feature.properties.section == 2){
            layer.on({
                // function called when pointer hovers on a state(layer)
                mouseover: highlightFeatureOther,
                // function called when pointer leaves a state(layer)
                mouseout: resetHighlight,
            });
        }
    }

    // Add all the states/counties to the map
    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    
});
