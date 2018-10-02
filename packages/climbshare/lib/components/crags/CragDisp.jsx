import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core'

class CragDisp extends Component {

  constructor(props){
    super(props);
    this.state = { selectedClimbId: '' }
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
          />
          <Components.CragMenu />
        </div>;

}

registerComponent({name:'CragDisp', component: CragDisp });
