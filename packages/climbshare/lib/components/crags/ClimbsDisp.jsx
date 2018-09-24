import React, {Component} from 'react'
import {Vector3} from 'three';
import {Components, registerComponent, withList, withCurrentUser} from 'meteor/vulcan:core'
import Climbs from '../../modules/climbs/collection.js'
import PropTypes from 'prop-types'

class ClimbsDisp extends Component {

  render = () =>
    <>
      {this.props.loading ? <p>loading</p> :
        this.props.results.map(
        climb =>
          <Components.ClimbItem
            climb={climb}
            scene={this.props.threescene}
            key={climb._id}
          />
      )}
    </>
}

const listOptions = {
  collection: Climbs
};

registerComponent({name: 'ClimbsDisp', component: ClimbsDisp, hocs: [withCurrentUser, [withList, listOptions]]});