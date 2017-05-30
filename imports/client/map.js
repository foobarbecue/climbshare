/**
 * Created by aaron on 5/28/2017.
 */

import ol from "openlayers"
//Use below to load unminified openlayers for debugging. npm/ is an alias defined in .babelrc and implemented using
//babel-plugin-module-resolver
//import ol from "npm/openlayers/dist/ol-debug.js"

Template.areaMap.onRendered(function(){
    this.subscribe("boulders");

    let area = FlowRouter.getParam('area');
    let areaBoulders = Boulders.find({area:area}); // could this be const?
    let boulderVectorSource = new ol.source.Vector();
    let clickLinks = new ol.interaction.Select({condition: ol.events.condition.click});

    let olmap = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    imagerySet:'AerialWithLabels',
                    key:'AnPtlHlc_-w6pMue8NZ_LsUszDvhVRBV7s5fIm--skojzTnNKFHneZrPdpecItva',
                })
            }),
            new ol.layer.Vector({source:boulderVectorSource})
        ],
        view: new ol.View({
            projection: 'EPSG:3857', // Web Mercator. This is the default, just being explicit.
            center: ol.proj.transform([-106.829, 34], 'EPSG:4326', 'EPSG:3857'), // Lon Lat to Web Mercator
            zoom: 10
        }),
        interactions: [clickLinks]
    });

    areaBoulders.observe({
        added: function(boulder){
            let boulderFeature = new ol.Feature({
                geometry: new ol.geom.Point(boulder.coords).transform('EPSG:4326', 'EPSG:3857'),
                name: boulder.name,
                //TODO improve -- something like Django's reverse()?
                url: '/' + boulder.area + '/' + boulder.name
            });
            if (!!boulder.coords) {
                boulderVectorSource.addFeature(boulderFeature);
                console.log(boulderFeature);
            }
        }
    });
});

