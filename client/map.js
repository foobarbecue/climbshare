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
    this.map.addLayer(new ol.layer.Vector({source: vectorSource}));

    this.autorun(function() {
        var area = Session.get('area');
        var areaBoulders = Boulders.find({area:area}).fetch();
        for (boulder in areaBoulders) {
            var boulderCoords = areaBoulders[boulder].coords;
            if (!!boulderCoords) {
                var boulderFeature = new ol.Feature({
                    geometry: new ol.geom.Point(boulderCoords).transform('EPSG:4326', 'EPSG:3857')
                });
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