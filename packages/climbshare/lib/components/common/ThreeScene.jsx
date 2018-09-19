import React, { Component } from 'react';
import TrackballControls from '../../client/three_extras/trackball.js'
import * as THREE from 'three';
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import Crags from "../../modules/crags/collection";
import '../../client/three_extras/nexus.js';
import NexusObject from '../../client/three_extras/nexus_three.js';

class ThreeScene extends Component{

  componentDidMount(){
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    window.scene = this.scene;

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
    this.controls = new TrackballControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 1;
    this.controls.panSpeed = 1;
    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.5;
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
    this.frameId = window.requestAnimationFrame(this.animate)
  };
  renderScene = () => {
    Nexus.beginFrame(this.renderer.context);
    this.renderer.render(this.scene, this.camera);
    Nexus.endFrame(this.renderer.context);
  };
  componentDidUpdate = (prevProps) => {
      if (!this.cragMesh || (this.props.document !== prevProps.document)){
          this.scene.remove(this.cragMesh);
          this.cragMesh = new NexusObject('/models3d/' + this.props.document.modelFilename,
              this.renderer,
              this.renderScene);
          let mat = new THREE.Matrix4();
          let initialTransform = this.props.document.initialTransform;
          mat.set.apply(mat, initialTransform);
          this.cragMesh.applyMatrix(mat);
          this.scene.add(this.cragMesh);
      }

  };
  render(){
    return(
      <div
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

const queryOptions = {
    collection: Crags
};

registerComponent('ThreeScene', ThreeScene, [withSingle, queryOptions]);
