import React from 'react'
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core'
import Crags from '../../modules/crags/collection.js'

const CragList = ({results=[]}) => {
  return (
      results.map(crag => <div> {crag.name} </div>)
  )
};


const listOptions = {
  collection: Crags
};

registerComponent({name:'CragList', component: CragList, hocs:[withCurrentUser, [withList, listOptions]]});