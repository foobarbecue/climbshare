import React from 'react'
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'

const FrontPage = () => {
    return <div>climbshare front page</div>;
};

registerComponent({name:'FrontPage', component: FrontPage });
