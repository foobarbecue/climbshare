import React from 'react'
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'

const CragItem = (props, context) => {
    return <Components.ThreeScene documentId={props.params._id} />;
};

registerComponent({name:'CragItem', component: CragItem });
