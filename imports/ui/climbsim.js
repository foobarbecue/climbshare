import THREE from 'three';
import '/imports/math_etc.js';
import '/imports/startup/client/three-extras/OrbitControls.js'
export let Climbsim = {};

var clock = new THREE.Clock();

Climbsim.init = function() {
  console.log(THREE);
  //$("#progressBar").progressbar();
  container = $('#threejs-container');
  Climbsim.scene = new THREE.Scene();
  projector = new THREE.Projector();
  mouse2D = v(0,0,0);
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 600 );
  // position and point the camera to the center of the scene
  camera.position.set(1,-20,5);
  // we use Z up for compatibility with UTM and lat lon
  camera.up.set(0,0,1);
  // make a 3D mouse out of a sphere for manipulating stuff
  mouse3D = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,6,6),
    new THREE.MeshBasicMaterial({color:'red',transparent:true}));
  Climbsim.scene.add(mouse3D);
  container.on('mousemove',onmousemove);
  // TODO maybe this in template event handlers
  container.on('dblclick', function(evt){
    tools.current.run()
  });

  // lights
  Climbsim.scene.add( new THREE.AmbientLight( 0x777777 ) );

  // grid
  grid = new THREE.GridHelper(100,1);
  grid.rotateX(Math.PI/2);
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
  Climbsim.controls = new THREE.OrbitControls( camera );
  Climbsim.controls.domElement = container[0];
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
}

Climbsim.addSkybox = function (){
  var path = "/skybox/";
  var format = '.jpg';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];
  console.log(THREE);
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  Climbsim.renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
  oscillator=((Math.sin(clock.getElapsedTime()*3))+Math.PI/2);
  mouse3D.material.color.setRGB(1,0,0);
  mouse3D.material.opacity=oscillator/Math.PI;
  Climbsim.renderer.render( Climbsim.scene, camera );
}