import React, {Component} from 'react'
import {Vector3, LineBasicMaterial} from 'three';
import {Components, registerComponent, withList, withCurrentUser} from 'meteor/vulcan:core'
import curvify from '../../modules/climbs/curvify.js'
import * as THREE from "three";

class ClimbItem extends Component {

  removeFromScene = () => {
    // Remove from three scene if already exists
    const existingClimb = this.props.scene.getObjectByName(this.props.climb._id); // TODO avoid always looking this up
    if (!!existingClimb) {
      this.props.scene.remove(existingClimb);
    }
  };

  addToScene = () =>{
    // "Curvify" segments and add to scene
    let vertices =  this.props.climb.vertices || this.props.newClimbVerts;
    if (vertices.length > 1){
      vertices = vertices.map((vertex) => new Vector3(... vertex));
      const color = (this.props.climb._id === this.props.selectedClimbId) ? 'red' : 'white';
      let material = new LineBasicMaterial({color: color});
      let climbCurvified = curvify(vertices, new THREE.Vector3(0,-1,0), material); // TODO probably worth optimizing
      climbCurvified.name = this.props.climb._id;
      this.props.scene.add(climbCurvified);
    }
  };

  componentWillUnmount = () => {
    this.removeFromScene()
  };

  componentDidUpdate = () => {
      this.removeFromScene();
      this.addToScene();
  };

  componentWillMount = () => {
    // If the climb has more than one vertex, (re)draw it on the three scene
    const vertices =  this.props.climb.vertices || this.props.newClimbVerts;
    if (vertices.length > 1) {
      this.removeFromScene();
      this.addToScene();
    }
  };

  selectThisClimb = ()=>{
    this.props.selectClimb(this.props.climb._id)
  };

  getLabelPositionStyle = () =>{
    const vertices =  this.props.climb.vertices || this.props.newClimbVerts;
    if (vertices.length > 1) {
      let pos3D = vertices[0];
      pos3D = new Vector3(...pos3D);
      const pos2D = pos3D.project(this.props.camera);
      const style = {
        left: (pos2D.x + 1) / 2 * window.innerWidth,
        top: -(pos2D.y - 1) / 2 * window.innerHeight
      };
      return style;
    }
    return null;
  };

  render = () => {
    const vertices =  this.props.climb.vertices || this.props.newClimbVerts;
    if (vertices.length > 1){
      return (
        <div
          className={"climb-label"}
          style={this.getLabelPositionStyle()}
          onMouseOver={this.selectThisClimb}
        >
          <div>{this.props.climb.name} <i>{this.props.climb.difficulty}</i></div>
        </div>
      )
    }
    else return null;
}
}


registerComponent({name: 'ClimbItem', component: ClimbItem});