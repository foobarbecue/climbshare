import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const Instructions = (props) =>
  <div className={"instructions-pane-wrapper"}>
  <div className={"instructions-pane"}>
    {props.activeTool ? props.activeTool.instructions : null}
  </div>
  </div>

registerComponent('Instructions', Instructions);
