if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraTarget, scene, renderer, mesh, mouse2D, mouse3D, raycaster, intersects, projector, oscillator, climbData;
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
        $("#progressBar").progressbar();
        container = $('#threejs-container')
        scene = new THREE.Scene();
        projector = new THREE.Projector();
        mouse2D = v(0,0,0)
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 600 );
        
        // position and point the camera to the center of the scene
        camera.position.set(1,-20,5)

        // we use Z up for compatibility with UTM and lat lon
//         camera.rotation.order="XYZ"
//         camera.rotation.set(Math.PI/2,0,0)
        camera.up.set(0,0,1)
        // make a 3D mouse out of a sphere for manipulating stuff
        mouse3D = new THREE.Mesh(
                new THREE.SphereGeometry(0.1,6,6),
                new THREE.MeshBasicMaterial({color:'red',transparent:true}));
        scene.add(mouse3D);
        container.on('mousemove',onmousemove)
        container.on('dblclick', function(evt){
            content = window.prompt('What words of wisdom would you like to anchor to the rock?')
            lbl = new Label(mouse3D.position, content,10);
        })


        // load boulder problems
        $.getJSON("data/data.json",
            function(data){
                climbData=data;
                loadBoulder('streambed');
            }
          )
        
        $('#boulderList').select(
            function (){loadBoulder(this.val())}
        )
        
        function loadBoulder(boulderName){
            boulder = climbData.boulders[boulderName]
        // loading boulder
            var loader = new THREE.PLYLoader();
            loader.addEventListener( 'load', function ( event ) {
                    var geometry = event.content;
                    var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
                    mesh = new THREE.Mesh( geometry, material );
                    scene.add( mesh );
                    $("#progressBar,#progressText").fadeOut();
            } );
            loader.addEventListener( 'progress', function ( event ) {
                console.log(event.loaded + ' of ' + event.total + ' loaded.')
                $("#progressBar").progressbar("value",( 100 * event.loaded / event.total ));
                $("#progressText").text( Math.floor(100 * event.loaded / event.total) + '% loaded' );
            } );
            loader.addEventListener( 'complete', function ( event ) {
                console.log('Done loading.')
                $('#intromessage').fadeIn();
            } );
            
            loader.load('data/models/' + boulder.model3D);
            addToBoulderList(boulderName, boulder);
            // load all of the climbs
            $.each(boulder.climbs, loadClimb);
        }
        
        function loadClimb(climbName, climb){
            vertices = $.map(climb.vertices, function(vert){return v(vert[0],vert[1],vert[2])});
            label = new Label(vertices[0],climbName);
            scene.add(curvify(vertices));
        }
        
        function addToBoulderList(boulderName, boulder){
            //TODO implement changing 3d model with this <select>
            boulderOpt = new Option(boulderName,boulder.model3D);
            $('#boulderList').append(new Option(boulderName));
        }
        
        // lights
        scene.add( new THREE.AmbientLight( 0x777777 ) );

        // grid
        grid = new THREE.GridHelper(100,1)
        grid.rotateX(Math.PI/2)
        scene.add(grid);
        
        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( container.width(), container.height());
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.append( renderer.domElement );

        // controls
        controls = new THREE.OrbitControls( camera );
        controls.domElement = container[0];
        controls.dragToLook = true;
        controls.rollSpeed = 0.5;
        controls.movementSpeed = 25;
        // listeners (which should probably go into a custom control at some point)
        controls.addEventListener( 'change', render );
        // resize
        window.addEventListener( 'resize', onWindowResize, false );
        
        
}

function onmousemove( e ){
        // mouse movement without any buttons pressed should move the 3d mouse
        e.preventDefault();
        mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse2D.z = 0.5;
        projector.unprojectVector(mouse2D.clone(), camera);
        raycaster = projector.pickingRay( mouse2D.clone(), camera );
        intersects = raycaster.intersectObject(mesh, true);
        if (intersects.length > 0){
            pos = intersects[0].point
            if (typeof pos != null) {
            mouse3D.position = pos;
//         controls.target = mouse3D.position;
            }
        }
        //TODO optimize this
        for (labelInd=0 ; labelInd < LabelPlugin.labels.length; labelInd++){
            lbl=LabelPlugin.labels[labelInd]
            intersects = raycaster.intersectObject(lbl.marker, true);
            if (intersects.length >0){
                $(lbl.el).fadeIn()
                lbl.showText=true;
            }
        }
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
            requestAnimationFrame( animate );
            controls.update();
            render();
}

function render() {
        oscillator=((Math.sin(clock.getElapsedTime()*3))+Math.PI/2);
        mouse3D.material.color.setRGB(1,0,0);
        mouse3D.material.opacity=oscillator/Math.PI;
        renderer.render( scene, camera );
        
        // remove progressBar
//         $("#progressBar").fadeOut();
}
});