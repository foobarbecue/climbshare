/**
 * Created by aaron on 5/28/2017.
 */

//import ol from "openlayers"
//Use below to load unminified openlayers for debugging. npm/ is an alias defined in .babelrc and implemented using
//babel-plugin-module-resolver
import leaflet from "leaflet"
import "leaflet-bing-layer"
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

    leaflet.Icon.Default.imagePath = '/images/';
    let map = leaflet.map('mapid', {
        closePopupOnClick: false,
        // Set latitude and longitude of the map center (required)
        center: [12.99766, -84.90838],
        // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
        zoom: 5,
    });
    let boulders = new leaflet.featureGroup();
    window.boulders = boulders;
    leaflet.tileLayer.bing('AnPtlHlc_-w6pMue8NZ_LsUszDvhVRBV7s5fIm--skojzTnNKFHneZrPdpecItva').addTo(map);
    areaBoulders.observe({
        added: function(boulder){
            console.log(boulder);
            try {
                let marker = leaflet.marker([boulder.coords[1], boulder.coords[0]]).addTo(map);
                marker.addTo(boulders);
                let label = leaflet.popup({autoClose: false});
                // Maybe this should be a meteor template. Dunno how I'd get it into the popup then though.
                label.setContent(
                    `<a href=/${encodeURI(area)}/${encodeURI(boulder.name)}>
                        <img src=/models3d/thumbs/${encodeURI(boulder.name)}.jpg>
                     </a>`
                );
                marker.bindPopup(label);
                marker.openPopup();
                map.fitBounds(boulders.getBounds());
            }
            catch (TypeError){
                 console.log('No coords for ' + boulder.name)
            }
        }
    });
});

window.leaflet = leaflet;