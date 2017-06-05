/**
 * Created by aaron on 5/28/2017.
 */

//import ol from "openlayers"
//Use below to load unminified openlayers for debugging. npm/ is an alias defined in .babelrc and implemented using
//babel-plugin-module-resolver
import leaflet from "leaflet"
import "leaflet-bing-layer"
import "leaflet/dist/leaflet.css"
import { Session } from "meteor/session"
import { jsPlumb } from "jsplumb"

var mapDisplay;
var boulderMarkerGroup;
var jsplumb;

Template.areaMap.onRendered(function(){
    this.subscribe("boulders");

    leaflet.Icon.Default.imagePath = '/images/';
    mapDisplay = leaflet.map('mapid', {
        closePopupOnClick: false,
        // Set latitude and longitude of the map center (required)
        center: [34,-107],
        // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
        zoom: 13,
    });
    boulderMarkerGroup = new leaflet.featureGroup();
    window.map = mapDisplay;
    leaflet.tileLayer.bing('AnPtlHlc_-w6pMue8NZ_LsUszDvhVRBV7s5fIm--skojzTnNKFHneZrPdpecItva').addTo(map);
    jsplumb = jsPlumb.getInstance();
    window.jsplumb = jsplumb;
    // Override getOffset because the one that comes with jsPlumb doesn't seem to work with leaflet markers (maybe because of
    // css translate3d?)
    jsplumb.getOffset = function(el, relativeToRoot, container){
         return $(el).offset();
    }
    }
);
Template.areaMap.helpers(
    // TODO this is same as in the onRendered... find out how to define only once
    {
        boulders: function () {
            let area = FlowRouter.getParam('area');
            return Boulders.find({'area': area});
        }
    }
);
Template.boulderthumb.onRendered(
    function() {
        let boulder = this.data;

        // Add to map
        // try {
        if(!!boulder.coords) {
            var marker = leaflet.marker([boulder.coords[1], boulder.coords[0]]).addTo(mapDisplay);
            marker.addTo(boulderMarkerGroup);
            marker.getElement().className += (' ' + boulder._id);
            var label = leaflet.popup(
                {
                    autoClose: false,
                    minWidth: '200px',
                    maxWidth: '200px',
                });
            // Maybe this should be a meteor template. Dunno how I'd get it into the popup then though.
            // label.setContent(
            //     `<a href=/${encodeURI(area)}/${encodeURI(boulder.name)}>
            //         <img src=/models3d/thumbs/${encodeURI(boulder.name)}.jpg>
            //      </a>`
            // );
            label.setContent(`<div id='${boulder.name}marker'>${boulder.name}</div>`);
            marker.bindPopup(label);
            mapDisplay.on('move',function(){
                jsplumb.repaintEverything();
            })
            map.fitBounds(boulderMarkerGroup.getBounds(),{padding: [50,50]});


            // Connect with jsPlumb
            var boulderThumbDiv = this.find('.boulderthumbInner');
            var markerDiv = marker._icon;
            if (markerDiv && boulderThumbDiv) {
                var thumbEl = jsplumb.addEndpoint(boulderThumbDiv, {anchor: 'AutoDefault'}, {
                    isSource: true,
                    isTarget: true
                });
                var markerEl = jsplumb.addEndpoint(markerDiv, {anchor: 'Center'});
                console.log(jsplumb.connect({source: markerEl, target: thumbEl}));
                // jsplumb.repaint(markerDiv, $(markerDiv).offset());
            }
        }
    }
);
