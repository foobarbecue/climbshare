import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Helmet from 'react-helmet'
import Crags from '../../modules/crags/collection.js'


const CragMenuItem = (props) => <span>{props.crag.name}</span>;

getMenuItem = (crag) => {

    return {
        to: { pathname: '/crag/' + crag._id }, //todo should use Utils.getRoutePath or something
        component: <CragMenuItem />,
        componentProps: {
            crag: crag,
            id: crag._id
        }
    }

}

const CragMenu = ({results=[]}) => {
  return (
      <div>

      <Components.Dropdown
          title = "crags"
          id = "cragDropdown"
          menuItems = {results.map(getMenuItem)}
      />
      </div>
  )
};


const listOptions = {
  collection: Crags
};

registerComponent({name:'CragMenu', component: CragMenu, hocs:[withCurrentUser, [withList, listOptions]]});
