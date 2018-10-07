import React, { Component } from 'react';
import {Components, registerComponent, withSingle} from 'meteor/vulcan:core';
import tools from '../../modules/tools.js';
import Crags from "../../modules/crags/collection";

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

          <h1 className={"crag-title"}>Climba climbscene: {this.props.document ? this.props.document.name : null}</h1>

          <Components.ThreeScene
            crag={this.props.document}
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

};

const CragDispAnnoyingWrapper = (props) => {
  return <Components.CragDisp documentId={props.params._id} />
};

registerComponent('CragDisp', CragDisp, [withSingle, { collection: Crags}]);
registerComponent('CragDispAnnoyingWrapper', CragDispAnnoyingWrapper);
