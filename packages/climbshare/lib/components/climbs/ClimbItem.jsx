import React, {Component} from 'react'
import {Vector3} from 'three';
import {Components, registerComponent, withList, withCurrentUser} from 'meteor/vulcan:core'
import curvify from '../../modules/climbs/curvify.js'

class ClimbItem extends Component {

  componentDidUpdate = () => {

    // If the climb has more than one vertex, (re)draw it on the three scene
    if (!!this.props.climb.vertices && (this.props.climb.vertices.length > 1)) {
      const climb = this.props.climb;
      const scene = this.props.scene;

      // Remove from three scene if already exists
      const existingClimb = scene.getObjectByName(climb._id);
      if (!!existingClimb) {
        console.log('removing' + this.props.climb._id);
        scene.remove(existingClimb);
      }

      // "Curvify" segments and add to scene
      const vertices = climb.vertices.map((vertex) => new Vector3(vertex[0], vertex[1], vertex[2]));
      const climbCurvified = curvify(vertices);
      climbCurvified.name = climb.id;
      console.log('adding' + this.props.climb.name);
      scene.add(climbCurvified);
    }
  };

  render = () => {
    return null
  };
}


registerComponent({name: 'ClimbItem', component: ClimbItem});