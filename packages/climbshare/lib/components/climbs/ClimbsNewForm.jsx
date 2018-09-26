import React from 'react';
import { Components, registerComponent, getFragment } from 'meteor/vulcan:core';

import Climbs from '../../modules/climbs/collection.js';

const ClimbsNewForm = ({currentUser, closeModal, show, cragId, successCallback}) => (
  <Components.Modal show={show} onHide={closeModal} title={"Add a new climb"}>
    <Components.SmartForm
      collection={Climbs}
      mutationFragment={getFragment('ClimbFormFragment')}
      successCallback={successCallback}
      onHide={closeModal}
      prefilledProps={{cragId}}
    />
  </Components.Modal>
);

registerComponent({ name: 'ClimbsNewForm', component: ClimbsNewForm });
