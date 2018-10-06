import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import tools from '../../modules/tools.js';

class CragDisp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedClimb: null,
      activeTool: tools[0]
    }
  }

  setActiveTool = (tool)=>{
    // TODO accept string
    this.setState({activeTool: tool})
  };

  selectClimb = (climb)=>{
    if (climb !== this.state.selectedClimb){
      this.setState({ selectedClimb: climb })
    }
  };

  render = ()=>
        <>
          <Components.ThreeScene
            documentId={this.props.params._id}
            selectedClimb={this.state.selectedClimb}
//          .selectedClimb alone doesn't trigger re-render
            selectedClimbId={this.state.selectedClimb ? this.state.selectedClimb._id : null}
            selectClimb={this.selectClimb}
            setActiveTool = {this.setActiveTool}
            activeTool={this.state.activeTool}
          />

          {/*Probably get rid of this once we have a nice crag list page*/}
          <Components.CragMenu />

          <Components.Toolbox
            setActiveTool = {this.setActiveTool}
            activeTool={this.state.activeTool}
          />
          {
            this.state.selectedClimb ?
            <Components.ClimbDetails
              documentId={this.state.selectedClimb._id}
            />
            : null
          }

          <Components.Instructions
            setActiveTool = {this.setActiveTool}
            activeTool={this.state.activeTool}
          />

        </>;

}

registerComponent({name:'CragDisp', component: CragDisp });
