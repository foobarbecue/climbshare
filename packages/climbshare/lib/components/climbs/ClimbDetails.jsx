import React, {Component} from 'react';
import {Components, registerComponent, withSingle, withCurrentUser} from 'meteor/vulcan:core';
import Climbs from '../../modules/climbs/collection.js'

class ClimbDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      showClimbEditForm: false
    }
  }

  showClimbEditForm = () =>{
    this.setState({showClimbEditForm:true})
  };

  hideClimbEditForm = () =>{
    this.setState({showClimbEditForm:false})
  };

  render = () => {
    if (this.props.loading) {return null}
    else return (
      <div className={"climb-details-pane"}>
        <h3>{this.props.document.name} <i>{this.props.document.difficulty}</i></h3>
        <p>{this.props.document.climbType}</p>
        <p>Created by {this.props.document.userId} on {this.props.document.createdAt}</p>
        <h5>Description</h5>
        <p>{this.props.document.description}</p>
        <h5>References</h5>
        <p>{this.props.document.references}</p>
        <div onClick={this.showClimbEditForm}>
          EDIT
        </div>
        <Components.ClimbsEditForm
          climb={this.props.document}
          show={this.state.showClimbEditForm}
          hide={this.hideClimbEditForm}
        />
      </div>
    )
  }
}

registerComponent('ClimbDetails', ClimbDetails,  [withSingle, {collection: Climbs}]);
