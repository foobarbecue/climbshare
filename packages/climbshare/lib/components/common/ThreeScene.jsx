import React, { Component } from 'react';
import * as THREE from 'three';
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import Crags from "../../modules/crags/collection";
import '../../client/three_extras/nexus.js';
import PLYLoader from 'three-ply-loader';
import NexusObject from '../../client/three_extras/nexus_three.js';
import OrbitControls from '../../client/three_extras/OrbitControls.js';
import curvify from '../../modules/climbs/curvify.js'

class ThreeScene extends Component{
  constructor(props){
    super(props);
    this.state = {
      climbFormOpen: false,
      threeSceneRendered: false,
      drawingNewClimb: false,
    }
    this.mouseMoving = false;
  }

  componentDidMount(){
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    window.threeSceneInstance = this;

    //lights
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    //camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.01,
      600
    );
    this.resetCameraPosition();

    //action
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

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
  };
  stop = () => {
    cancelAnimationFrame(this.frameId)
  };
  animate = () => {
    this.controls.update();
    this.renderScene();
    this.setState({'threeSceneRendered':true});
    this.frameId = window.requestAnimationFrame(this.animate)
  };
  move3DmouseTo2Dmouse = (e) =>{
    this.mouseMoving = true;

      // don't move the mouse3D if we are orbiting the view
      if (!!this.controls && (this.controls.state !== this.controls.STATES.NONE)){
          return
      }
      this.mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse2D.z = 0.5;
      if (this.hasOwnProperty("cragMeshLoRes")){
          this.raycaster.setFromCamera(this.mouse2D, this.camera);
          let intersects = this.raycaster.intersectObject(this.cragMeshLoRes, true);
          if (intersects.length > 0) {
              let intersect = intersects[0];
              this.mouse3D.position.copy(intersect.point);

        }
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
    if (!this.props.loading) {
      // if we've loaded a crag and need to switch to new one
      if (!!this.cragMesh && (this.props.document !== prevProps.document)) {
        // remove old mesh & cleanup
        this.scene.remove(this.cragMesh);
        delete this.cragMesh; //TODO Could get rid of this and check scene.children.includes later instead
        if (this.hasOwnProperty("cragMeshLoRes")) {
          this.scene.remove(this.cragMeshLoRes)
        }
        Nexus.clearContexts();
      }

      // if there's no mesh loaded (either first load, or we just removed successfully)
      if (!this.cragMesh) {
        // reset camera -- need this on first load as well as switching mesh
        this.resetCameraPosition();

        // load new high res mesh
        this.cragMesh = new NexusObject('/models3d/' + this.props.document.modelFilename,
          this.renderer,
          this.renderScene);
        let mat = new THREE.Matrix4();
        let initialTransform = this.props.document.initialTransform;
        mat.set.apply(mat, initialTransform);
        this.cragMesh.applyMatrix(mat);
        this.cragMesh.material.side = THREE.DoubleSide;
        this.scene.add(this.cragMesh);

        // Load low res version of mesh for raycasting.
        // This is a hack until https://github.com/cnr-isti-vclab/nexus/issues/9 is resolved.
        if (this.props.document.hasOwnProperty("modelFilenameLoRes")) {
          PLYLoader(THREE); // super weird but using as advised in package instructions
          let plyloader = new THREE.PLYLoader;
          plyloader.load('/models3d/' + this.props.document.modelFilenameLoRes, (geom) => {
            this.cragMeshLoRes = new THREE.Mesh(geom);
            this.cragMeshLoRes.material.visible = false;
            this.cragMeshLoRes.applyMatrix(mat);
            this.scene.add(this.cragMeshLoRes);
          })
        }
      }
    }
  };

  onMouseDown = (evt) => {
    this.mouseMoving = false;
  }

  onMouseUp = (evt) => {

    // this is to prevent triggering onclick at the end of a drag
    if(!this.mouseMoving){
      // If it's a right click and we're drawing a climb, then finish drawing the climb
      if (evt.button==2){
        if (this.state.drawingNewClimb){
          this.addNewVertexToClimb(this.state.drawingNewClimb, this.mouse3D.position);
          this.setState({drawingNewClimb:false});
        }
      } else{
        this.onClick()
      }
    }
  };

  onClick = () => {
    if (this.state.drawingNewClimb){
      this.addNewVertexToClimb(this.state.drawingNewClimb, this.mouse3D.position)
    }else{
      this.setState({climbFormOpen:true});
    }
  };

  addNewVertexToClimb(climb, position){
    console.log(`adding ${position} to ${climb}`);
  }

  closeClimbForm = () => {
    this.setState({climbFormOpen:false})
  };

  beginDrawingClimb = (document) => {
    this.setState((state, props)=>{
      return {climbFormOpen:false, drawingNewClimb: document._id}
    })
  };

  render = () => {
    return(
        <>
        <div
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          ref={(mount) => { this.mount = mount }}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.move3DmouseTo2Dmouse}
          onMouseUp={this.onMouseUp}
        />
        <Components.ClimbsNewForm
          cragId = {this.props.documentId}
          threeScene = {this.scene}
          show = {this.state.climbFormOpen}
          closeModal = {this.closeClimbForm}
          successCallback = {this.beginDrawingClimb}
        />
        <Components.ClimbsDisp
          terms={{cragId: this.props.documentId}}
          cragId = {this.props.documentId}
          threescene={this.scene}
          threeSceneRendered={this.state.threeSceneRendered}
        />
        </>
    )
  }
}

const queryOptions = {
    collection: Crags
};

registerComponent('ThreeScene', ThreeScene, [withSingle, queryOptions]);
