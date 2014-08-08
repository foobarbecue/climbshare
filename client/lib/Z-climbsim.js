// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// This object contains the scene and all manipulators of it
Climbsim = {};

var container;

var camera, cameraTarget, boulderMesh, mouse2D, raycaster, intersects, projector, oscillator, climbData, climbsimInit, climbsimAnimate;
var clock = new THREE.Clock();
var projector = new THREE.Projector();
var paused = false;
Climbsim.scene = {};

Climbsim.init = function() {
        $("#progressBar").progressbar();
        container = $('#threejs-container')
        Climbsim.scene = new THREE.Scene();
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
        Climbsim.scene.add(mouse3D);
        container.on('mousemove',onmousemove)
        // TODO maybe this in template event handlers
        container.on('dblclick', function(evt){
            tools.current.run()
        })
        
        // lights
        Climbsim.scene.add( new THREE.AmbientLight( 0x777777 ) );

        // grid
        grid = new THREE.GridHelper(100,1)
        grid.rotateX(Math.PI/2)
        Climbsim.scene.add(grid);
        Climbsim.scene.add( new THREE.AmbientLight( 0x777777 ) );
        // renderer
        Climbsim.renderer = new THREE.WebGLRenderer( { antialias: true } );
        Climbsim.renderer.setSize( container.width(), container.height());
        Climbsim.renderer.gammaInput = true;
        Climbsim.renderer.gammaOutput = true;
        Climbsim.renderer.setClearColor(Session.get('sceneBkgrndClr'));
        container.append( Climbsim.renderer.domElement );

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
        
        // skybox
        Climbsim.addSkybox();
        
}

Climbsim.removeAllClimbs = function(){
    $(Climbsim.scene.children).each(function(){
        if (this instanceof THREE.Line && !(this instanceof THREE.GridHelper)){
            Climbsim.scene.remove(this);
        }
    });
}

Climbsim.loadClimb = function(climb){
    if (climb.vertices.length > 1){
        vertices = $.map(climb.vertices, function(vert){return v(vert[0],vert[1],vert[2])});
        climbCurvified = curvify(vertices)
        climbCurvified.name=climb._id
        var existing = Climbsim.scene.getObjectByName(climb._id)
        if (!!existing){
            Climbsim.scene.remove(existing);
        }
        Climbsim.scene.add(climbCurvified);
        return climbCurvified
    }
    else{
        // climb does not have enough vertices to draw
        return null
    }
}

Climbsim.loadBoulder = function(boulderName){
    $("#progressBar,#progressText").show();                    
    if (typeof(boulderName) === "undefined"){
        boulderName = Session.get('loadedBoulder')
    }
    boulder = Boulders.findOne({name:boulderName})
    // clear previous 3d model
    Climbsim.scene.remove(Climbsim.boulderMesh)
    // clear all climbs
    this.removeAllClimbs();
    // load CTM model
    var loader = new THREE.CTMLoader();
    loader.load('data/models/' + boulder.model3D, 
                function(geometry){
                    var boulderMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, side: THREE.DoubleSide});
                    Climbsim.boulderMesh = new THREE.Mesh(geometry, boulderMaterial);
                    Climbsim.boulderMesh.name = boulderName;
                    if (!!boulder.initialTransform){
                        var xform = new THREE.Matrix4();
                        xform.set.apply(xform,boulder.initialTransform)
                        Climbsim.boulderMesh.applyMatrix(xform);
                    }
                    Climbsim.scene.add(Climbsim.boulderMesh);
                    $("#progressBar,#progressText").fadeOut();                    
                    Climbsim.loadClimbs();
                    });
    if (!!boulder.pointcloud){
        var material = new THREE.ParticleSystemMaterial( { size: 0.05, vertexColors: true } );
        var pco=POCLoader.load("data/models/" + boulder.pointcloud);
        var pointcloud = new Potree.PointCloudOctree(pco, material);
        pointCloud.name = 'pointcloud'
        Climbsim.scene.add(pointcloud);
    }
}

Climbsim.loadClimbs = function(){
    boulder = Boulders.findOne({name:Session.get('loadedBoulder')});
    if (!!boulder){
        Climbsim.removeAllClimbs();
        Climbs.find({boulder_id:boulder._id}).map(Climbsim.loadClimb);
    }
}

Climbsim.addNewClimb = function (){
    boulder = Boulders.findOne({name:Session.get('loadedBoulder')});
    newClimb = Climbs.insert({
        climbName: 'new climb',
        boulder_id: boulder._id,
        createdBy:Meteor.userId(),
        vertices:[[
            mouse3D.position.x,
            mouse3D.position.y,
            mouse3D.position.z
        ]]
    },
        function(error){
             alert(error);
        }
    );
    if (!!newClimb){
        Session.set('addClimbVertices')
        return newClimb
    }
}

// Skybox
Climbsim.addSkybox = function (){
    var path = "/skybox/";
    var format = '.jpg';
    var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
    ];

    var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );
    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
    mesh.name = 'skybox'
    Climbsim.scene.add( mesh );
};

Climbsim.addLabelForClimb = function(climb){
    climb = climb || Climbsim.latestClimb
    Labels.insert(
        {content:climb.climbName,
        position:{
            x:climb.vertices[0][0],
            y:climb.vertices[0][1],
            z:climb.vertices[0][2]
        },
        refers_to_boulder:Boulders.findOne({name:Session.get('loadedBoulder')})._id,
        refers_to_id:climb._id,
        refers_to_type:'climb',
        createdBy: climb.createdBy || 'automatic',
        createdOn:new Date()}
    )
}

Climbsim.addVertexToClimb = function(climb){
    // if climb not passed in as argument, work on the one that's selected.
    // TODO should factor this out or otherwise simplify.
    climb = climb || Climbs.findOne(Labels.findOne(Session.get('selectedLabel')).refers_to_id);
    Climbs.update({_id:climb._id}, {$push:{vertices:
        [
        mouse3D.position.x,
        mouse3D.position.y,
        mouse3D.position.z        
    ]    
    }});
    
}

Climbsim.moveLatestVertexToMousePos= function(){
    climb = Climbs.findOne(Climbsim.latestClimbId);
    if (climb.vertices.length > 1){
    Climbs.update({_id:climb._id}, {$pop: {vertices:1}});
    };
    Climbs.update({_id:climb._id}, {$push:{vertices:
        [
        mouse3D.position.x,
        mouse3D.position.y,
        mouse3D.position.z
    ]    
    }});
    Climbsim.loadClimb(climb);
}

function onmousemove( e ){
        // mouse movement without any buttons pressed should move the 3d mouse
        e.preventDefault();
        mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse2D.z = 0.5;
        projector.unprojectVector(mouse2D.clone(), camera);
        raycaster = projector.pickingRay( mouse2D.clone(), camera );
        intersects = raycaster.intersectObject(Climbsim.boulderMesh, true);
        if (intersects.length > 0){
            pos = intersects[0].point
            if (typeof pos != null) {
            mouse3D.position = pos;
            }
        }
        // stream mouse position to db
        Meteor.call('updateMouse3D',mouse3D.position);

        // live drawing for addClimb mouseTool
        if (!!tools.current && tools.current.name == 'addVertexToClimb'){
            Climbsim.moveLatestVertexToMousePos();
        }
}

Climbsim.drawOtherUsers3Dmice = function(){
    //TODO use a builtin color map?
    var colors=['blue','green','orange','teal']
    Mice.find().forEach(
        //TODO if user is logged in
        function(mouse3Ddoc, ind){
            color=colors[ind]
            var otherUsrMouse3D = new THREE.Mesh(
            new THREE.SphereGeometry(0.1,6,6),
            new THREE.MeshBasicMaterial({color:color,transparent:true}));
            otherUsrMouse3D.name=mouse3Ddoc._id;
            var existing = Climbsim.scene.getObjectByName(mouse3Ddoc._id)
            Climbsim.scene.remove(existing);
            Climbsim.scene.add(otherUsrMouse3D);
            otherUsrMouse3D.position.set(
                mouse3Ddoc.position.x,
                mouse3Ddoc.position.y,
                mouse3Ddoc.position.z);
        }
    )
}

function addDirLight( x, y, z, color, intensity ) {
        var directionalLight = new THREE.DirectionalLight( color, intensity );
        directionalLight.position.set( x, y, z )
        Climbsim.scene.add( directionalLight );
}

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        Climbsim.renderer.setSize( window.innerWidth, window.innerHeight );
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
        Climbsim.renderer.render( Climbsim.scene, camera );
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