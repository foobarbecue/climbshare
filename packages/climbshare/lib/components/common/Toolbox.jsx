import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';

class Toolbox extends Component {
  render = () =>
    <div className={"toolbox-pane"}>The toolbox is not yet implemented.</div>
}

registerComponent('Toolbox', Toolbox);
