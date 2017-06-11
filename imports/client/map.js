/**
 * Created by aaron on 5/28/2017.
 */

//import ol from "openlayers"
//Use below to load unminified openlayers for debugging. npm/ is an alias defined in .babelrc and implemented using
//babel-plugin-module-resolver
import leaflet from "leaflet"
import "leaflet-bing-layer"
import "leaflet/dist/leaflet.css"
import {jsPlumb} from "jsplumb"

let mapDisplay;
const jsplumb = jsPlumb.getInstance({
    Connector:["Bezier",{stub:20}],
    PaintStyle:{ stroke: "black", strokeWidth: 5}

});

Template.areaMap.onRendered(function () {
        this.subscribe("boulders");

        leaflet.Icon.Default.imagePath = '/images/';
        mapDisplay = leaflet.map('mapid', {
            closePopupOnClick: false,
            // Set latitude and longitude of the map center (required)
            center: [34, -107],
            // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
            zoom: 13,
        });
        boulderMarkerGroup = new leaflet.featureGroup();
        leaflet.tileLayer.bing('AnPtlHlc_-w6pMue8NZ_LsUszDvhVRBV7s5fIm--skojzTnNKFHneZrPdpecItva').addTo(mapDisplay);
        // Override getOffset because the one that comes with jsPlumb doesn't seem to work with leaflet markers (maybe because of
        // css translate3d or 0-size div?)
        jsplumb.getOffset = function (el, relativeToRoot, container) {
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
    function () {
        let boulder = this.data;

        if (!!boulder.coords) {
            let marker = leaflet.marker([boulder.coords[1], boulder.coords[0]]).addTo(mapDisplay);
            marker.addTo(boulderMarkerGroup);
            marker.getElement().className += (' ' + boulder._id);
            let label = leaflet.popup(
                {
                    autoClose: false,
                    minWidth: '200px',
                    maxWidth: '200px',
                });

            label.setContent(`<div id='${boulder.name}marker'>${boulder.name}</div>`);
            marker.bindPopup(label);
            mapDisplay.on('move', function () {
                jsplumb.repaintEverything();
            });
            mapDisplay.fitBounds(boulderMarkerGroup.getBounds(), {padding: [50, 50]});

            // Connect with jsPlumb
            let boulderThumbDiv = this.find('.boulderthumbInner');
            let markerDiv = marker._icon;
            if (markerDiv && boulderThumbDiv) {
                let thumbEl = jsplumb.addEndpoint(boulderThumbDiv, {anchor: 'AutoDefault'});
                let markerEl = jsplumb.addEndpoint(markerDiv, {anchor: 'BottomCenter'},{paintStyle:{fill:"none", stroke:"black"}});
                jsplumb.connect({source: markerEl, target: thumbEl});
            }
        }
    }
);
