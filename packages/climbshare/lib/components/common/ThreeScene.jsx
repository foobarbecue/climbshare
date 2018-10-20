import React, { Component } from 'react';
import * as THREE from 'three';
import { Components, withMessages, registerComponent, withSingle, withUpdate, withCurrentUser } from 'meteor/vulcan:core'
import Crags from "../../modules/crags/collection";
import Climbs from "../../modules/climbs/collection";
import '../../client/three_extras/nexus.js';
import PLYLoader from 'three-ply-loader';
import NexusObject from '../../client/three_extras/nexus_three.js';
import OrbitControls from '../../client/three_extras/OrbitControls.js';
import curvify from '../../modules/climbs/curvify.js'
import tools from '../../modules/tools.js'
import {FormattedMessage} from "meteor/vulcan:i18n";

class ThreeScene extends Component{
  constructor(props){
    super(props);
    this.state = {
      climbFormOpen: false,
      threeSceneRendered: false,
      newClimbId: '',
      newClimbVerts: [],
      cameraPosition: []
    };
    this.newClimb = null;
  }

  onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount(){

    this.scene = new THREE.Scene();
    window.threeSceneInstance = this;

    //lights
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    //camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.01,
      600
    );
    this.resetCameraPosition();

    //grid
    const grid = new THREE.GridHelper(100, 100);
    grid.rotateX(Math.PI / 2);
    this.scene.add(grid);

    //skybox
    const skyboxLoader = new THREE.CubeTextureLoader();
    skyboxLoader.setPath("/skybox/");
    const textureCube = skyboxLoader.load([
      'px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg']);
    const shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = textureCube;
    const material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      }),

    skybox = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
    skybox.name = 'skybox';
    this.scene.add(skybox);

    //action
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    window.addEventListener('resize',this.onResize);
    this.onResize();
    this.mount.appendChild(this.renderer.domElement);
    this.renderer.domElement.classList.add("threeScene");

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.rotateSpeed = 0.5;
    this.controls.panSpeed = 0.5;
    this.controls.screenSpacePanning = true;

    this.mouse2D = new THREE.Vector3(0, 0, 0);
    this.mouse3D = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 6, 6),
        new THREE.MeshBasicMaterial({color: 'red', transparent: true}));
    this.scene.add(this.mouse3D);
    this.raycaster = new THREE.Raycaster();

    this.start();
  }

  resetCameraPosition(){
    // position and point the camera to the center of the scene
    this.camera.position.set(1, -20, 5);
    // we use Z up for compatibility with UTM and lat lon
    this.camera.up.set(0, 0, 1);
  }

  componentWillUnmount(){
    this.stop();
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
    this.setState({'threeSceneRendered':true});
  };

  stop = () => {
    cancelAnimationFrame(this.frameId)
  };

  animate = () => {
    this.controls.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate)
  };

  move3DmouseTo2Dmouse = (evt) =>{
      // don't move the mouse3D if we are orbiting the view
      // TODO this is doing a similar thing to this.controls.movedRecently so maybe share logic
      if (this.controls.state !== this.controls.STATES.NONE || evt.type==='wheel'){
        this.setState({cameraPosition: this.camera.position.toArray()})
        return
      }
      this.mouse2D.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.mouse2D.y = -(evt.clientY / window.innerHeight) * 2 + 1;
      this.mouse2D.z = 0.5;
      if (this.hasOwnProperty("cragMeshLoRes")){
          this.raycaster.setFromCamera(this.mouse2D, this.camera);
          let intersects = this.raycaster.intersectObject(this.cragMeshLoRes, true);
          if (intersects.length > 0) {
              let intersect = intersects[0];
              this.mouse3D.position.copy(intersect.point);
        }
      }

      // If the user is drawing a new climb, then animate the last segment to follow the mouse
      if (this.state.newClimbVerts.length > 0){
        const lastVertIndex = this.state.newClimbVerts.length -1;
        const startPos = new THREE.Vector3( ... this.state.newClimbVerts[lastVertIndex]);
        const terminalSegment = curvify([startPos, this.mouse3D.position]);
        terminalSegment.name = 'terminalSegment';
        try {this.scene.remove(this.scene.getObjectByName('terminalSegment'))} catch(err){}
        this.scene.add(terminalSegment);
      }

  };

  renderScene = () => {
    Nexus.beginFrame(this.renderer.context);
    this.renderer.render(this.scene, this.camera);
    Nexus.endFrame(this.renderer.context);
  };


  //TODO this code manually adds, removes, and changes which mesh is shown. There's probably a more elegant way.
  //for example, a child component for crags with mount and unmount methods
  componentDidUpdate = (prevProps) => {
      // if we've loaded a crag and need to switch to new one
      if (!!this.cragMesh && (this.props.crag !== prevProps.crag)) {
        // remove old mesh & cleanup
        this.scene.remove(this.cragMesh);
        delete this.cragMesh; //TODO Could get rid of this and check scene.children.includes later instead
        if (this.hasOwnProperty("cragMeshLoRes")) {
          this.scene.remove(this.cragMeshLoRes)
        }
        Nexus.clearContexts();
      }

      // if there's no mesh loaded (either first load, or we just removed successfully)
      if (!this.cragMesh && this.props.crag) {
        // reset camera -- need this on first load as well as switching mesh
        this.resetCameraPosition();

        // load new high res mesh
        this.cragMesh = new NexusObject('/models3d/' + this.props.crag.modelFilename,
          this.renderer,
          this.renderScene);
        let mat = new THREE.Matrix4();
        let initialTransform = this.props.crag.initialTransform;
        mat.set.apply(mat, initialTransform);
        this.cragMesh.applyMatrix(mat);
        this.cragMesh.material.side = THREE.DoubleSide;
        this.scene.add(this.cragMesh);

        // Load low res version of mesh for raycasting.
        // This is a hack until https://github.com/cnr-isti-vclab/nexus/issues/9 is resolved.
        if (this.props.crag.hasOwnProperty("modelFilenameLoRes")) {
          PLYLoader(THREE); // super weird but using as advised in package instructions
          let plyloader = new THREE.PLYLoader;
          plyloader.load('/models3d/' + this.props.crag.modelFilenameLoRes, (geom) => {
            this.cragMeshLoRes = new THREE.Mesh(geom);
            this.cragMeshLoRes.material.visible = false;
            this.cragMeshLoRes.applyMatrix(mat);
            this.scene.add(this.cragMeshLoRes);
          })
        }
      }
  };

  onClick = (evt) => {
    evt.preventDefault()

    //Ignore click if we are manipulating the 3D view controls
    if (!!this.controls && this.controls.recentlyMoved) {
      return null;
    }

    switch (this.props.activeTool.name) { //TODO maybe move tool logic into tools.js
      case 'addClimb':
        // User clicked on the rock. If not logged in, prompt for login.
        if (!this.props.currentUser) {

          let res = this.props.flash({key: 'users.please_log_in', message: 'Please log in to create or edit climbs.'});
          return null;
        }

        //If a climb isn't in progress, start one
          this.setState({climbFormOpen: true});
        break;

      case 'drawClimb':
          {
          //Left mouse click: add vertex to climb
          if (evt.button == 0) {
            this.addVertexToNewClimb(this.mouse3D.position);
            return null;
          }

          //Right mouse click: finish climb
          if (evt.button == 2) {
            this.addVertexToNewClimb(this.mouse3D.position);
            const verticesForDB = (this.state.newClimbVerts.concat([this.mouse3D.position.toArray()]));
            this.props.updateClimb({
              selector: {_id: this.state.newClimbId},
              data: {'vertices': verticesForDB}
            });
            this.setState({newClimbId: '', newClimbVerts: []});
            this.newClimb = null;
            this.props.setActiveTool(tools[0]) // TODO enum or make setActiveTool take string or something
          }
        }
        break;

        // TODO rest of the tools
    }

  };

  addVertexToNewClimb = (position) => {
    this.setState({newClimbVerts:
        this.state.newClimbVerts.concat(
          [position.toArray()]
        )
    });
  };

  closeClimbForm = () => {
    this.setState({climbFormOpen:false})
  };

  beginDrawingClimb = (document) => {
    this.setState({climbFormOpen:false, newClimbId: document._id});
    this.newClimb = document;
    this.addVertexToNewClimb(this.mouse3D.position);
    this.props.setActiveTool(tools[1]);
  };

  render = () => {
    return(
        <>
        <div
          className={"threeScene"}
          ref={(mount) => { this.mount = mount }}
          onClick={this.onClick}
          onContextMenu={this.onClick} // need this because onClick doesn't trigger on right click
          onMouseMove={this.move3DmouseTo2Dmouse}
          onWheel={this.move3DmouseTo2Dmouse} // TODO not working
        />
        <Components.ClimbsNewForm
          crag = {this.props.crag}
          threeScene = {this.scene}
          show = {this.state.climbFormOpen}
          closeModal = {this.closeClimbForm}
          successCallback = {this.beginDrawingClimb}
        />
        <Components.ClimbsDisp
          crag = {this.props.crag}
          threescene={this.scene}
          threeSceneRendered={this.state.threeSceneRendered}
          newClimbVerts={this.state.newClimbVerts}
          camera={this.camera}
          cameraPosition={this.state.cameraPosition}
          selectedClimb={this.props.selectedClimb}
          selectedClimbId={this.props.selectedClimbId}
          selectClimb={this.props.selectClimb}
          terms={{cragId: this.props.crag ? this.props.crag._id : ''}}
        />
        </>
    )
  }
}


const climbHoCOptions = {
  collection: Climbs
};

registerComponent('ThreeScene', ThreeScene, withCurrentUser, withMessages, [withUpdate, climbHoCOptions]);
