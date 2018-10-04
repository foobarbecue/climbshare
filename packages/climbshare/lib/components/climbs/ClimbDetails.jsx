import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';
import Climbs from '../../modules/climbs/collection.js'

class ClimbDetails extends Component {
  render = () => {
    if (this.props.loading) {return null}
    else return (
      <div className={"climb-details-pane"}>
        <h1>{this.props.document.name}</h1>
      </div>
    )
  }
}

const withSingleOptions = {
  collection: Climbs
};

registerComponent('ClimbDetails', ClimbDetails, [withSingle, withSingleOptions]);
