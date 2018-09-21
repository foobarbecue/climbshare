import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Helmet from 'react-helmet'
import Climbs from '../../modules/climbs/collection.js'


const ClimbMenuItem = (props) => <span>{props.climb.name}</span>;

const getMenuItem = (climb) => {
    return {
        to: { pathname: '/climb/' + climb._id }, //todo should use Utils.getRoutePath or something
        component: <ClimbMenuItem />,
        componentProps: {
            climb: climb,
            id: climb._id
        }
    }
};

const ClimbMenu = ({results=[]}) => {
  return (
      <div>

      <Components.Dropdown
          title = "climbs"
          id = "climbDropdown"
          menuItems = {results.map(getMenuItem)}
      />
      </div>
  )
};


const listOptions = {
  collection: Climbs
};

registerComponent({name:'ClimbMenu', component: ClimbMenu, hocs:[withCurrentUser, [withList, listOptions]]});
