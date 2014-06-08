// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// This object contains the scene and all manipulators of it
Climbsim = {};

var container;

var camera, cameraTarget, renderer, boulderMesh, mouse2D, raycaster, intersects, projector, oscillator, climbData, loadClimb, climbsimInit, climbsimAnimate;
var clock = new THREE.Clock();
var projector = new THREE.Projector();
var paused = false;

Climbsim.init = function() {
        $("#progressBar").progressbar();
        container = $('#threejs-container')
        window.threeScene = new THREE.Scene();
        projector = new THREE.Projector();
        mouse2D = v(0,0,0)
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 600 );
        // position and point the camera to the center of the scene
        camera.position.set(1,-20,5)
        // we use Z up for compatibility with UTM and lat lon
        camera.up.set(0,0,1)
        // make a 3D mouse out of a sphere for manipulating stuff
        mouse3D = new THREE.Mesh(
                new THREE.SphereGeometry(0.1,6,6),
                new THREE.MeshBasicMaterial({color:'red',transparent:true}));
        window.threeScene.add(mouse3D);
        container.on('mousemove',onmousemove)
        container.on('dblclick', function(evt){
            if (Meteor.user() != null){
            labelID=Labels.insert({
                content:'type here',
                position:{
                    x:mouse3D.position.x,
                    y:mouse3D.position.y,
                    z:mouse3D.position.z
                },
                createdBy:Meteor.userId(),
                //TODO Well that's obviously wrong. Same value in two fields.
                createdByName:Meteor.userId(),
                createdOn:TimeSync.serverTime(),
                refers_to_boulder:Boulders.findOne({name:Session.get('loadedBoulder')})._id,
                refers_to_type:null
            });
             $("#" + labelID + " .label3Dcontent").focus();
             $("#" + labelID + " .label3Dcontent").selectText();
            }
            else{
                alert('Sign up / log in to add data.')
            }
        })
        

        
        // lights
        window.threeScene.add( new THREE.AmbientLight( 0x777777 ) );

        // grid
        grid = new THREE.GridHelper(100,1)
        grid.rotateX(Math.PI/2)
        window.threeScene.add(grid);
        
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

Climbsim.removeAllClimbs = function(){
    $(threeScene.children).each(function(){
        if (this instanceof THREE.Line && !(this instanceof THREE.GridHelper)){
            threeScene.remove(this);
        }
    });
}

Climbsim.loadClimb = function(climb){
    vertices = $.map(climb.vertices, function(vert){return v(vert[0],vert[1],vert[2])});
    climbCurvified = curvify(vertices)
    climbCurvified.name=climb._id
    window.threeScene.add(climbCurvified);
    return climbCurvified
}

Climbsim.loadBoulder = function(boulderName){
    if (typeof(boulderName) === "undefined"){
        boulderName = Session.get('loadedBoulder')
    }
    boulder = Boulders.findOne({name:boulderName})
    // clear previous 3d model
    window.threeScene.remove(boulderMesh)
    // clear all climbs
    this.removeAllClimbs();
    // load CTM model
    var loader = new THREE.CTMLoader();
    loader.load('data/models/' + boulder.model3D, 
                function(geometry){
                    var boulderMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
                    boulderMesh = new THREE.Mesh(geometry, boulderMaterial);
                    boulderMesh.name = boulderName;
                    threeScene.add(boulderMesh);
                    $("#progressBar,#progressText").fadeOut();                    
                    Climbs.find({boulder_id:boulder._id}).map(Climbsim.loadClimb);
                    })
}


function onmousemove( e ){
        // mouse movement without any buttons pressed should move the 3d mouse
        e.preventDefault();
        mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse2D.z = 0.5;
        projector.unprojectVector(mouse2D.clone(), camera);
        raycaster = projector.pickingRay( mouse2D.clone(), camera );
        intersects = raycaster.intersectObject(boulderMesh, true);
        if (intersects.length > 0){
            pos = intersects[0].point
            if (typeof pos != null) {
            mouse3D.position = pos;
            }
        }
}

function addDirLight( x, y, z, color, intensity ) {
        var directionalLight = new THREE.DirectionalLight( color, intensity );
        directionalLight.position.set( x, y, z )
        window.threeScene.add( directionalLight );
}

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
}

Climbsim.animate = function() {
        requestAnimationFrame( Climbsim.animate );
        controls.update();
        Labels.find().map(positionLabel);
        render();
}

function render() {
        oscillator=((Math.sin(clock.getElapsedTime()*3))+Math.PI/2);
        mouse3D.material.color.setRGB(1,0,0);
        mouse3D.material.opacity=oscillator/Math.PI;
        renderer.render( window.threeScene, camera );
}

// moves div of a label to the correct 2D coordinates
// based on its 3D .position value
function positionLabel(label){
    labelElement=$('.label3D.'+label._id)[0]
    if(labelElement){
    p3D=v(label.position.x, label.position.y, label.position.z); 
    p2D=projector.projectVector(p3D,camera)
    //scale from normalized device coordinates to window
    labelElement.style.left= (p2D.x + 1)/2 * window.innerWidth + 'px';
    labelElement.style.top= - (p2D.y - 1)/2 * window.innerHeight + 'px';
    }
}