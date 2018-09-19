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

    //lights
    this.scene.add(new THREE.AmbientLight(0x777777));

    //camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 4;

    //action
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.controls = new TrackballControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 5;
    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.1;
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
    Nexus.beginFrame(this.renderer.context);
    this.renderer.render(this.scene, this.camera);
    Nexus.endFrame(this.renderer.context);
  };
  componentDidUpdate = () => {
      this.cragMesh = new NexusObject('/models3d/pecksm.nxz', this.renderer, this.renderScene);
      this.scene.add(this.cragMesh)
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
