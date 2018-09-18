import React, { Component } from 'react'
import { Components, registerComponent, withSingle } from 'meteor/vulcan:core'
import '../crags/CragMenu.jsx'

class FrontPage extends Component {
    render(){
        return <div><Component.CragMenu /></div>;
    }
}


registerComponent({name:'FrontPage', component: FrontPage });
