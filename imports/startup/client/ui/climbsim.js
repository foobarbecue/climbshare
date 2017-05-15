import * as THREE from 'three';
import '/imports/math_etc.js';
//TODO find a better solution for including the three.js "examples" addons
import '/imports/startup/client/three-extras/OrbitControls.js'
// import '/imports/startup/client/three-extras/ctm/CTMLoader.js'
import '/imports/startup/client/three-extras/TrackballControls.js'
import '/imports/startup/client/three-extras/nexus.js'
import '/imports/startup/client/three-extras/nexus_three.js'
// import '/imports/startup/client/three-extras/gltf'
export let Climbsim = {};
window.three = THREE;
window.Climbsim = Climbsim;
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var mouse2D, intersects, oscillator;
Climbsim.init = function() {
  //$("#progressBar").progressbar();
  Climbsim.container = $('#threejs-container');
  Climbsim.scene = new THREE.Scene();
  var projector = new THREE.Projector();
  mouse2D = v(0,0,0);
  //Climbsim.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 600 );
   Climbsim.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 100 );
   Climbsim.camera.position.z = 4;
  // position and point the camera to the center of the scene
  Climbsim.camera.position.set(1,-20,5);
  // we use Z up for compatibility with UTM and lat lon
  Climbsim.camera.up.set(0,0,1);
  // make a 3D mouse out of a sphere for manipulating
    // stuff
  Climbsim.mouse3D = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,6,6),
    new THREE.MeshBasicMaterial({color:'red',transparent:true}));
  Climbsim.scene.add(Climbsim.mouse3D);
  Climbsim.container.on('mousemove',onmousemove);
  // TODO maybe this in template event handlers
  Climbsim.container.on('dblclick', function(evt){
    tools.current.run()
  });

  // lights
  Climbsim.scene.add( new THREE.AmbientLight( 0x777777 ) );

  // grid
  var grid = new THREE.GridHelper(100,1);
  grid.rotateX(Math.PI/2);
  Climbsim.scene.add(grid);
  Climbsim.scene.add( new THREE.AmbientLight( 0x777777 ) );
  // renderer
  Climbsim.renderer = new THREE.WebGLRenderer( { antialias: false } );
  Climbsim.renderer.setSize( Climbsim.container.width(), Climbsim.container.height());
  Climbsim.renderer.gammaInput = true;
  Climbsim.renderer.gammaOutput = true;
  Climbsim.renderer.setClearColor(Session.get('sceneBkgrndClr'));
  Climbsim.container.append( Climbsim.renderer.domElement );

  // controls
  Climbsim.controls = new THREE.OrbitControls( Climbsim.camera, Climbsim.container[0] );
  // TODO get rid of this line
  Climbsim.controls.domElement = Climbsim.container[0];
  Climbsim.controls.dragToLook = true;
  Climbsim.controls.rollSpeed = 0.5;
  Climbsim.controls.movementSpeed = 25;
  // listeners (which should probably go into a custom control at some point)
  Climbsim.controls.addEventListener( 'change', render );
  // resize
  window.addEventListener( 'resize', onWindowResize, false );

  // skybox
  Climbsim.addSkybox();

  Climbsim.ready = true;
};

Climbsim.addSkybox = function (){
  var path = "/skybox/";
  var format = '.jpg';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];
  var skyboxLoader = new THREE.CubeTextureLoader();
  skyboxLoader.setPath("/skybox/");
  var textureCube = skyboxLoader.load([
    'px.jpg', 'nx.jpg',
    'py.jpg', 'ny.jpg',
    'pz.jpg', 'nz.jpg']);
  // var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );
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

Climbsim.removeAllClimbs = function(){
  $(Climbsim.scene.children).each(function(){
    if (this instanceof THREE.Line && !(this instanceof THREE.GridHelper)){
      Climbsim.scene.remove(this);
    }
  });
};

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
};

Climbsim.loadBoulder = function(boulderName){
  $("#progressBar,#progressText").show();
  if (typeof(boulderName) === "undefined"){
    boulderName = Session.get('loadedBoulder')
  }
  boulder = Boulders.findOne({name:boulderName})

  // clear previous 3d model
  Climbsim.scene.remove(Climbsim.boulderMesh);
  // clear all climbs
  this.removeAllClimbs();
  // load CTM model
  // var loader = new THREE.CTMLoader();
    Climbsim.boulderMesh = new NexusObject("/models3d/pecksm.nxs", Climbsim.renderer, render);
    Climbsim.boulderMesh.side = THREE.DoubleSide;

  // loader.load('/models3d/' + boulder.model3D,
    // function(geometry){
    //   if (!!boulder.texture){
    //     var boulderMaterial = new THREE.MeshBasicMaterial({
    //       map: THREE.ImageUtils.loadTexture('/models3d/' + boulder.texture),
    //       side: THREE.DoubleSide
    //     })
    //   } else {
    //     var boulderMaterial = new THREE.MeshBasicMaterial(
    //       {vertexColors: THREE.VertexColors, side: THREE.DoubleSide}
    //     );
    //   }
    //   Climbsim.boulderMesh = new THREE.Mesh(geometry, boulderMaterial);
    //   Climbsim.boulderMesh.name = boulderName;
    //   if (!!boulder.initialTransform){
    //     var xform = new THREE.Matrix4();
    //     xform.set.apply(xform,boulder.initialTransform)
    //     Climbsim.boulderMesh.applyMatrix(xform);
    //   }
      Climbsim.scene.add(Climbsim.boulderMesh);
      $("#progressBar,#progressText").fadeOut();
      Climbsim.loadClimbs();
    // });
  // if (!!boulder.pointcloud){
  //   var material = new THREE.ParticleSystemMaterial( { size: 0.05, vertexColors: true } );
  //   var pco=POCLoader.load("/" + boulder.pointcloud);
  //   var pointcloud = new Potree.PointCloudOctree(pco, material);
  //   pointCloud.name = 'pointcloud'
  //   Climbsim.scene.add(pointcloud);
  // }
};

Climbsim.loadClimbs = function(){
  boulder = Boulders.findOne({name:Session.get('loadedBoulder')});
  if (!!boulder){
    Climbsim.removeAllClimbs();
    Climbs.find({boulder_id:boulder._id}).map(Climbsim.loadClimb);
  }
};

Climbsim.addNewClimb = function (){
  boulder = Boulders.findOne({name:Session.get('loadedBoulder')});
  newClimb = Climbs.insert({
    climbName: 'new climb',
    boulder_id: boulder._id,
    createdBy:Meteor.userId(),
    vertices:[[
      Climbsim.mouse3D.position.x,
      Climbsim.mouse3D.position.y,
      Climbsim.mouse3D.position.z
    ]]
  });
  if (!!newClimb){
    Session.set('addClimbVertices')
    return newClimb
  }
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
};

Climbsim.addVertexToClimb = function(climb){
  // if climb not passed in as argument, work on the one that's selected.
  // TODO should factor this out or otherwise simplify.
  climb = climb || Climbs.findOne(Labels.findOne(Session.get('selectedLabel')).refers_to_id);
  Climbs.update({_id:climb._id}, {$push:{vertices:
    [
      Climbsim.mouse3D.position.x,
      Climbsim.mouse3D.position.y,
      Climbsim.mouse3D.position.z
    ]
  }});

};

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
};

function onmousemove( e ){
  // mouse movement without any buttons pressed should move the 3d mouse
  e.preventDefault();
  mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouse2D.z = 0.5;
  // projector.unprojectVector(mouse2D.clone(), camera);
  // raycaster = projector.pickingRay( mouse2D.clone(), camera );
  raycaster.setFromCamera(mouse2D,Climbsim.camera);
  if (typeof Climbsim.boulderMesh !== 'undefined') {
      intersects = raycaster.intersectObject(Climbsim.boulderMesh, true);
      if (intersects.length > 0) {
          var pos = intersects[0].point;
          if (typeof pos != null) {
              Climbsim.mouse3D.position.set(pos.x, pos.y, pos.z);
          }
      }
  }

//  live drawing for addClimb mouseTool
  if (typeof tools!=="undefined" &&
    !!tools.current
    && tools.current.name == 'addVertexToClimb'){
    Climbsim.moveLatestVertexToMousePos();
  }
}

Climbsim.animate = function() {
  requestAnimationFrame( Climbsim.animate );
  Climbsim.controls.update();
  Labels.find().map(positionLabel);
  render();
}

function render() {
  oscillator=((Math.sin(clock.getElapsedTime()*3))+Math.PI/2);
  Climbsim.mouse3D.material.color.setRGB(1,0,0);
  Climbsim.mouse3D.material.opacity=oscillator/Math.PI;
  Nexus.beginFrame(Climbsim.renderer.context);
  Climbsim.renderer.render( Climbsim.scene, Climbsim.camera );
  Nexus.endFrame(Climbsim.renderer.context);
}

function onWindowResize() {
  Climbsim.camera.aspect = window.innerWidth / window.innerHeight;
  Climbsim.camera.updateProjectionMatrix();
  Climbsim.renderer.setSize( window.innerWidth, window.innerHeight );
}

// moves div of a label to the correct 2D coordinates
// based on its 3D .position value
function positionLabel(label){
  var labelElement=$('.label3D.'+label._id)[0]
  if(labelElement){
    p3D=v(label.position.x, label.position.y, label.position.z);
    p2D=p3D.project(Climbsim.camera);
    //scale from normalized device coordinates to window
    labelElement.style.left= (p2D.x + 1)/2 * window.innerWidth + 'px';
    labelElement.style.top= - (p2D.y - 1)/2 * window.innerHeight + 'px';
  }
}