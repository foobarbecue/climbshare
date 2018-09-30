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
import {FormattedMessage} from "meteor/vulcan:i18n";

class ThreeScene extends Component{
  constructor(props){
    super(props);
    this.state = {
      climbFormOpen: false,
      threeSceneRendered: false,
      newClimbId: '',
      newClimbVerts: []
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

    //action
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    window.addEventListener('resize',this.onResize);
    this.onResize();

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

  move3DmouseTo2Dmouse = (e) =>{

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
      // if (this.state.newClimbId){
      //   // const lastVertIndex = this.newClimb.vertices.length -1;
      //   // this.newClimbTerminalSegment = curvify([this.newClimbVerts[lastVertIndex], this.mouse3D.position]);
      //   // this.scene.remove(this.newClimbTerminalSegment);
      // }

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

  onClick = (evt) => {
    //Ignore click if we are manipulating the 3D view controls
    if (!!this.controls && this.controls.recentlyMoved) {
      return null;
    }

    // User clicked on the rock. If not logged in, prompt for login.
    if (!this.props.currentUser){

      let res = this.props.flash({key: 'users.please_log_in', message:'Please log in to create or edit climbs.'});
      return null;
    }

    //If a climb isn't in progress, start one
    if (!this.state.newClimbId){
      this.setState({climbFormOpen:true});
      return null;
    }else {
      //Left mouse click: add vertex to climb
      if (evt.button == 0) {
        this.addVertexToNewClimb(this.mouse3D.position);
        return null;
      }

      //Right mouse click: finish climb
      if (evt.button == 2) {
        this.addVertexToNewClimb(this.mouse3D.position);
        this.props.updateClimb({
          selector: {_id: this.state.newClimbId},
          data: {'vertices': this.state.newClimbVerts.map((vert) => vert.toArray())}
        });
        this.setState({newClimbId: '', newClimbVerts: []});
        this.newClimb = null;
      }
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
  };

  render = () => {
    return(
        <>
        <div
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          ref={(mount) => { this.mount = mount }}
          onClick={this.onClick}
          onContextMenu={this.onClick} // need this because onClick doesn't trigger on right click
          onMouseMove={this.move3DmouseTo2Dmouse}
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
          newClimbVerts={this.state.newClimbVerts}
        />
        </>
    )
  }
}

const cragHoCOptions = {
  collection: Crags
};

const climbHoCOptions = {
  collection: Climbs
};

registerComponent('ThreeScene', ThreeScene, withCurrentUser, withMessages, [withSingle, cragHoCOptions], [withUpdate, climbHoCOptions]);
