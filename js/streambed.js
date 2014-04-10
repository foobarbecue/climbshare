if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraTarget, scene, renderer, mesh;
var clock = new THREE.Clock();
var paused = false;

//Do everything inside the jquery onload callback
$(function(){
    
init();
animate();
/**
 * Convenience function for making Vector3s
 */
function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

/**
 * Given @start and @end points, create a curve that is "pulled" at the midpoint towards @pull.
 * Useful for 
 * @param {Vector3} start
 * @param {Vector3} end
 * @param {Vector3} pull
 */
function midPullPoint(start, end, pull) {
    // have to work on a clone because lerp modifes in place
    midPullPointSln = start.clone()
    midPullPointSln.lerp(end, 0.5);
    midPullPointSln.add(pull);
    return midPullPointSln
}

/**
 * Given a list of vectors representing a boulder problem, produce splines that curve away
 * from the rock so as to stay visible.
 * @param {Array} pointlist
 * @param {Vector3} pull
 * @param {Material} material
 */
function curvify(pointlist, pull, material) {
    var pull = pull || v(0,-1,0)
    var material = material || new THREE.LineBasicMaterial();
    var cp = new THREE.CurvePath();
    for ( var i=0 ; i < pointlist.length-1 ; i++){
        start = pointlist[i]
        end = pointlist[i+1]
        midPointPulled=midPullPoint(start, end, pull)
        curveSegment=new THREE.QuadraticBezierCurve3(start, midPointPulled, end); 
        cp.add(curveSegment);
    }
    curvifiedProblem = new THREE.Line(cp.createPointsGeometry(200) , material)
    return curvifiedProblem
}

function init() {
        document.addEventListener("keypress", onkeypress, false);
        $("#progressbar").progressbar();
        container = $('#threejs-container')[0]
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 600 );
        
        // position and point the camera to the center of the scene
        camera.position.set(1,-20,5)

        // we use Z up for compatibility with UTM and lat lon
        camera.rotation.order="XYZ"
        camera.rotation.set(Math.PI/2,0,0)

        // streambed model
        var loader = new THREE.PLYLoader();
        loader.addEventListener( 'load', function ( event ) {
                var geometry = event.content;
                var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
                mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );
        } );
        loader.addEventListener( 'progress', function ( event ) {
            console.log(event.loaded + ' of ' + event.total + ' loaded.')
            $("#progressbar").progressbar("value",( 100 * event.total / event.loaded ));
        } );
        loader.load( './data/models/streambedTrimmed.ply' );

        // boulder problems
        line = new THREE.Line();
            // Some sample data for now. This will
            // eventually be loaded from a file or db.
        rightRoof = [v(-6.741744,1.987208,2.180861),
                 v(-6.619035,1.239210,2.984409),
                 v(-6.731589,0.466374,3.441104),
                 v(-7.651319,-0.011100,3.294760),
                 v(-7.596357,-0.482435,3.572817),
                 v(-7.532446,-0.632361,4.077475)]
        line.geometry.vertices=rightRoof;
        lineMaterial = new THREE.LineBasicMaterial();
        scene.add(line);
        scene.add(curvify(line.geometry.vertices));
        
        // lights
        scene.add( new THREE.AmbientLight( 0x777777 ) );

        // grid
        grid = new THREE.GridHelper(100,1)
        grid.rotateX(Math.PI/2)
        scene.add(grid);
        
        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( container.offsetWidth, container.offsetHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );

        // controls
        controls = new THREE.FlyControls( camera );
        controls.domElement = container;
        controls.dragToLook = true;
        controls.rollSpeed = 0.5;
        controls.movementSpeed = 25;

        // resize
        window.addEventListener( 'resize', onWindowResize, false );
}

function addDirLight( x, y, z, color, intensity ) {
        var directionalLight = new THREE.DirectionalLight( color, intensity );
        directionalLight.position.set( x, y, z )
        scene.add( directionalLight );
}

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
        if (!paused){
            requestAnimationFrame( animate );
            render();
            }
}

function render() {
        controls.update(clock.getDelta());
        renderer.render( scene, camera );
        // remove progressbar
        $("#progressbar").fadeOut();
}
});