import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';

const tools = ['addClimb','addBeta','addWarning','addOther'];

class Toolbox extends Component {
  render = () =>

    <div className={"toolbox-pane"}>
      {tools.map((toolName)=>
        <img className={'toolIcon'} src={'/tool_icons/'+toolName+'.png'} key={toolName}/>
      )}
    </div>
}

registerComponent('Toolbox', Toolbox);
