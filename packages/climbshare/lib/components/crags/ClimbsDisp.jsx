import React, {Component} from 'react'
import {Vector3} from 'three';
import {Components, registerComponent, withList, withCurrentUser} from 'meteor/vulcan:core'
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
      {(this.props.threeSceneRendered && !this.props.loading) ? this.props.results.map(
        climb =>
          <Components.ClimbItem
            climb={climb}
            scene={this.props.threescene}
            key={climb._id}
            threeSceneRendered={this.props.threeSceneRendered}
          />
      ) : <p>waiting for threescene</p>}
    </>
}

const listOptions = {
  collection: Climbs
};

registerComponent({name: 'ClimbsDisp', component: ClimbsDisp, hocs: [withCurrentUser, [withList, listOptions]]});