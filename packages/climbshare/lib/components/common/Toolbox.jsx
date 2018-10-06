import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';

class Toolbox extends Component {
  render = () =>

    <div className={"toolbox-pane"}>
      <span className={"pane-header"}>Toolbox</span>
      <p>Will be collapsable and filled with tool icons and such.</p>
    </div>
}

registerComponent('Toolbox', Toolbox);
