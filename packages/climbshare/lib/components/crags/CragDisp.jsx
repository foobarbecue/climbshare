import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core'

class CragDisp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedClimbId: '' ,
      activeTool: 'drawClimb' // TODO tools module. Probably a base class and inheritance
    }
  }

  selectClimb = (climbId)=>{
    if (climbId !== this.state.selectedClimbId){
      this.setState({ selectedClimbId: climbId })
    }
  };

  render = ()=>
        <div>
          <Components.ThreeScene
            documentId={this.props.params._id}
            selectedClimbId={this.state.selectedClimbId}
            selectClimb={this.selectClimb}
            activeTool={this.state.activeTool}
          />

          {/*Probably get rid of this once we have a nice crag list page*/}
          <Components.CragMenu />

          <Components.ToolBox />
          {this.state.selectedClimbId ?
            <Components.ClimbDetails documentId={this.state.selectedClimbId}/> : null
          }

        </div>;

}

registerComponent({name:'CragDisp', component: CragDisp });
