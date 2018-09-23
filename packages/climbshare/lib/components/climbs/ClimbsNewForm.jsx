import React from 'react';
import { Components, registerComponent, getFragment } from 'meteor/vulcan:core';

import Climbs from '../../modules/climbs/collection.js';

const ClimbsNewForm = ({currentUser, closeModal, show, cragId}) => (
  <Components.Modal show={show} onHide={closeModal}>
    <Components.SmartForm
      collection={Climbs}
      mutationFragment={getFragment('ClimbFormFragment')}
      successCallback={closeModal}
      onHide={closeModal}
      prefilledProps={{cragId}}
      fields={['name','climbType','difficulty','cragId']}
    />
  </Components.Modal>
);

registerComponent({ name: 'ClimbsNewForm', component: ClimbsNewForm });
