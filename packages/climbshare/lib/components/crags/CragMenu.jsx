import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Helmet from 'react-helmet'
import Crags from '../../modules/crags/collection.js'


const CragMenuItem = (props) => <span>{props.crag.name}test</span>;

getMenuItem = (crag) => {

    return {
        to: { pathname: '/crag/' + crag._id }, //todo should use Utils.getRoutePath or something
        component: <CragMenuItem />,
        componentProps: {
            crag: crag
        }
    }

}

const CragMenu = ({results=[]}) => {
  return (
      <div>
      <Helmet>
          <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
      </Helmet>
      <Components.Dropdown
          title = "crags"
          menuItems = {results.map(getMenuItem)}
      />
      </div>
  )
};


const listOptions = {
  collection: Crags
};

registerComponent({name:'CragMenu', component: CragMenu, hocs:[withCurrentUser, [withList, listOptions]]});
