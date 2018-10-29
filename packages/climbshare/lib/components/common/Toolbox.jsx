import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';
import tools from '../../modules/tools.js';

const Toolbox = (props) =>
  <div className={"toolbox-pane"}>

    {tools.map((tool) => {
        if (tool.name) {
          return (<img
            className={
              (props.activeTool && (tool.name === props.activeTool.name))
                ? 'toolIcon selected'
                : 'toolIcon'}
            onClick={() => {
              props.setActiveTool(tool)
            }}
            src={'/tool_icons/' + tool.name + '.png'}
            key={tool.name}
          />)
        }
      }
    )}
  </div>;

registerComponent('Toolbox', Toolbox);
