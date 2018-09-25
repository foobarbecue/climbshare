import React, {Component} from 'react'
import {Vector3} from 'three';
import {Components, registerComponent, withList, withCurrentUser} from 'meteor/vulcan:core'
import curvify from '../../modules/climbs/curvify.js'

class ClimbItem extends Component {
  constructor (props) {
    super(props)
  }

  removeFromScene = () => {
    // Remove from three scene if already exists
    const existingClimb = this.props.scene.getObjectByName(this.props.climb._id);
    if (!!existingClimb) {
      this.props.scene.remove(existingClimb);
    }
  };

  addToScene = () =>{
    // "Curvify" segments and add to scene
    const vertices = this.props.climb.vertices.map((vertex) => new Vector3(vertex[0], vertex[1], vertex[2]));
    const climbCurvified = curvify(vertices);
    climbCurvified.name = this.props.climb._id;
    this.props.scene.add(climbCurvified);
  };

  componentWillUnmount = () => {
    this.removeFromScene()
  };

  componentDidUpdate = () => {

  };

  componentWillMount = () => {
    // If the climb has more than one vertex, (re)draw it on the three scene
    if (!!this.props.climb.vertices && (this.props.climb.vertices.length > 1)) {

      this.removeFromScene();
      this.addToScene();
    }
  }

  render = () => {

    return null
  };
}


registerComponent({name: 'ClimbItem', component: ClimbItem});