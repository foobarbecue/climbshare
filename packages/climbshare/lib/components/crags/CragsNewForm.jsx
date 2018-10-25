import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Crags from '../../modules/crags/collection.js';

const CragsNewForm = (props) =>
  <div>
    <Components.SmartForm
      collection={Crags}
      successCallback={props.closeModal}
    />
  </div>;

registerComponent({name: 'CragsNewForm', component: CragsNewForm});
