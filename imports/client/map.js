/**
 * Created by aaron on 5/28/2017.
 */

//import ol from "openlayers"
//Use below to load unminified openlayers for debugging. npm/ is an alias defined in .babelrc and implemented using
//babel-plugin-module-resolver
import leaflet from "leaflet"
import "leaflet/dist/leaflet.css"

Template.areaMap.onRendered(function(){
    this.subscribe("boulders");

    // $(window).resize(function () {
    //     var h = $(window).height(), offsetTop = 90; // Calculate the top offset
    //     $('#mapid').css('height', (h - offsetTop));
    // }).resize();

    let area = FlowRouter.getParam('area');
    let areaBoulders = Boulders.find({area:area}); // could this be const?
    // clickLinks.on('select', function(evt){
    //     window.open(evt.target.getFeatures().getArray()[0].get('url'));
    // });

// Initialize the map and assign it to a variable for later use
    var map = leaflet.map('mapid', {
        // Set latitude and longitude of the map center (required)
        center: [12.99766, -84.90838],
        // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
        zoom: 5
    });

// Create a Tile Layer and add it to the map
    var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);

    areaBoulders.observe({
        added: function(boulder){
            // let marker = leaflet.marker([boulder.coords[0], boulder.coords[1]]).addTo(areamap);
        }
    });
});

