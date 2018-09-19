import React, { Component } from 'react';
import TrackballControls from '../../no_module_avail/trackball.js'
import * as THREE from 'three';
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import Crags from "../../modules/crags/collection";

class ThreeScene extends Component{

  componentDidMount(){
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 4;
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    //Add controls
    this.controls = new TrackballControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 5;
    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.1;
    // this.controls.minDistance = 2;
    // this.controls.maxDistance = 12;

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.start();
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
    this.renderer.render(this.scene, this.camera)
  };
  componentDidUpdate = () => {
      this.cube.material.color.set(this.props.document.color)
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
