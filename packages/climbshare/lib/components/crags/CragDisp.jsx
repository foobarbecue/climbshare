import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core'

class CragDisp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedClimb: null,
      activeTool: 'drawClimb' // TODO tools module. Probably a base class and inheritance
    }
  }

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
            activeTool={this.state.activeTool}
          />

          {/*Probably get rid of this once we have a nice crag list page*/}
          <Components.CragMenu />

          <Components.Toolbox />
          {
            this.state.selectedClimb ?
            <Components.ClimbDetails
              documentId={this.state.selectedClimb._id}
            />
            : null
          }

        </>;

}

registerComponent({name:'CragDisp', component: CragDisp });
