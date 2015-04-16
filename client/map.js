Template.areaMap.onRendered(function() {
    this.map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'sat'})
            })
        ],
        view: new ol.View({
            center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
            zoom: 4
        })
    });
    var vectorSource = new ol.source.Vector({
    });
        //{
        //    text: new ol.style.Text({
        //        text:'test',
        //        font: '12px Calibri,sans-serif'
        //    }),
        //    stroke: new ol.style.Stroke({color: 'red', width: 2})
        //}
    var fill = new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 1.25
    });

    var markerStyle = function(feature) {
        return [new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 5
            }),
            fill: fill,
            stroke: stroke,
            text: new ol.style.Text({
                text: feature.get('name'),
                fill: fill,
                stroke: stroke
            })
        })];
    };

    var vectorLayer = new ol.layer.Vector({source: vectorSource});
    vectorLayer.setStyle(markerStyle);
    this.map.addLayer(vectorLayer);

    this.autorun(function() {
        var area = Session.get('area');
        var areaBoulders = Boulders.find({area:area}).fetch();
        for (boulder in areaBoulders) {
            var boulderCoords = areaBoulders[boulder].coords;
            if (!!boulderCoords) {
                var boulderFeature = new ol.Feature({
                    geometry: new ol.geom.Point(boulderCoords).transform('EPSG:4326', 'EPSG:3857'),
                    name: areaBoulders[boulder].name
                });
                //
                //TODO need to check if it's already there, or come up with better data binding
                vectorSource.addFeature(boulderFeature);
            }
        }
        // Zoom to the points
        var map = Template.instance().map;
        map.getView().fitExtent(vectorSource.getExtent(), map.getSize());
    });
    window.olmap = this.map;
    this.map.render();
});