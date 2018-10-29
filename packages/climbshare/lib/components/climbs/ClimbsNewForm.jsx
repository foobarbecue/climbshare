import React from 'react';
import { Components, registerComponent, getFragment } from 'meteor/vulcan:core';

import Climbs from '../../modules/climbs/collection.js';

const ClimbsNewForm = ({currentUser, closeModal, show, crag, successCallback, vertices}) => (
  <Components.Modal show={show} onHide={closeModal} title={"Add a new climb"}>
    <Components.SmartForm
      collection={Climbs}
      successCallback={successCallback}
      onHide={closeModal}
      prefilledProps={{
        cragId: (crag ? crag._id : null),
        vertices
      }}
    />
  </Components.Modal>
);

registerComponent({ name: 'ClimbsNewForm', component: ClimbsNewForm });
