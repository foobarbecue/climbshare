import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Helmet from 'react-helmet'
import Crags from '../../modules/crags/collection.js'


const CragMenu = ({results=[]}) => {
  return (
      <div>
      <Helmet>
          <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
      </Helmet>
      <Components.Dropdown
          title = "crags"
          menuItems = {results.map(crag => crag.name)}
      />
      </div>
  )
};


const listOptions = {
  collection: Crags
};

registerComponent({name:'CragMenu', component: CragMenu, hocs:[withCurrentUser, [withList, listOptions]]});
