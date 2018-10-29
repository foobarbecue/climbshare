import React, {Component} from 'react'
import {Vector3} from 'three';
import {Components, registerComponent, withMulti, withCurrentUser} from 'meteor/vulcan:core'
import Climbs from '../../modules/climbs/collection.js'
import PropTypes from 'prop-types'

class ClimbsDisp extends Component {

  constructor(props) {
    super(props);
    this.state = {readyToDraw: false}
  }

  // componentDidUpdate(props){
  //   if(this.props.threeSceneRendered){
  //     this.setState({readyToDraw: true})
  //   }
  // }

  render = () =>
    <>
      {(this.props.threeSceneRendered && !this.props.loading) ?
        this.props.results.map(
        climb =>
          <Components.ClimbItem
            climb={climb}
            vertices={climb.vertices}
            scene={this.props.threescene}
            key={climb._id}
            threeSceneRendered={this.props.threeSceneRendered}
            camera={this.props.camera}
            cameraPosition={this.props.cameraPosition}
            selectedClimb={this.props.selectedClimb}
            selectedClimbId={this.props.selectedClimbId}
            selectClimb={this.props.selectClimb}
          />
      ) : <p>waiting for threescene</p>}

      {/*Climb currently being drawn*/}
      <Components.ClimbItem
        climb={{climb:{_id:'newclimb'}}}
        vertices={this.props.newClimbVerts}
        scene={this.props.threescene}
        key={'newclimb'}
        threeSceneRendered={this.props.threeSceneRendered}
        camera={this.props.camera}
        cameraPosition={this.props.cameraPosition}
      />
    </>
}

const listOptions = {
  collection: Climbs
};

registerComponent({name: 'ClimbsDisp', component: ClimbsDisp, hocs: [withCurrentUser, [withMulti, listOptions]]});