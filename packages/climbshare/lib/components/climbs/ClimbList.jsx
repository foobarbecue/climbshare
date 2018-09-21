import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Climbs from '../../modules/climbs/collection.js'

const ClimbList = ({results=[]}) => {
  return (
      results.map(climb => <div> {climb.name}, {climb.cragId} </div>)
  )
};


const listOptions = {
  collection: Climbs
};

registerComponent({name:'ClimbList', component: ClimbList, hocs:[withCurrentUser, [withList, listOptions]]});