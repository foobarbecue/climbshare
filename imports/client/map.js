/**
 * Created by aaron on 5/28/2017.
 */
import ol from "openlayers";


let area = FlowRouter.getParam('area');
let areaBoulders = Boulders.find({area:area}); // could this be const?
let map;

Template.areaMap.onRendered(function(){
    this.subscribe("boulders");
    map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.BingMaps({
                        imagerySet:'AerialWithLabels',
                        key:'AnPtlHlc_-w6pMue8NZ_LsUszDvhVRBV7s5fIm--skojzTnNKFHneZrPdpecItva',
                    })
                })
            ],
        view: new ol.View({
            projection: 'EPSG:3857', // Web Mercator. This is the default, but being explicit.
            center: ol.proj.transform([-106.829, 34], 'EPSG:4326', 'EPSG:3857'), // Lon Lat to Web Mercator
            zoom: 10
        })
    })
});

Template.areaMap.onCreated(function(){
    areaBoulders.observe({
        added: function(boulder){
            console.log('adding'+boulder.name)
        }
    })
});

