import React from 'react'
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'

const CragItem = (props, context) => {
    return (
        <div>
            <Components.ThreeScene documentId={props.params._id} />
            <Components.CragMenu />
        </div>
    );
};

registerComponent({name:'CragItem', component: CragItem });
