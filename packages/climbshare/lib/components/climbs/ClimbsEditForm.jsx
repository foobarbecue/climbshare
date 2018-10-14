import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Climbs from '../../modules/climbs/collection.js';

const ClimbsEditForm = ({climb, hide, show}) => (
  <Components.Modal show={show} onHide={hide} title={"Edit climb"}>
    <Components.SmartForm
      collection={Climbs}
      documentId={climb._id}
      onHide={hide}
    />
  </Components.Modal>
);

registerComponent({ name: 'ClimbsEditForm', component: ClimbsEditForm });
