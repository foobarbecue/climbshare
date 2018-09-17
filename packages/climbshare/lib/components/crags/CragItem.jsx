import React from 'react'
import { Components, registerComponent } from 'meteor/vulcan:core'

import Crags from '../../modules/crags/collection.js'

if (Meteor.isClient){
    console.log(Crags);
}


const CragItem = (props, context) => (
    <div>this will be a single crag</div>
);

registerComponent({name:'CragItem', component: CragItem });
