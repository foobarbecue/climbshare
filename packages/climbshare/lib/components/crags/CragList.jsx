import React from 'react';
import { Link } from 'react-router';
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core';
import Crags from '../../modules/crags/collection.js';

const CragList = ({results = []}) => {
  return <div className={"crag-list"}>
  {results.map(crag =>
    <div className={"crag-item"}>
      <Link to={`/crag/${crag._id}`}>
        <img className={"crag-thumb"} src={crag.thumbnail} key={crag._id}></img>
        <h4>{crag.name}</h4>
      </Link>
    </div>
  )}
  </div>
};


const listOptions = {
  collection: Crags
};

registerComponent({name:'CragList', component: CragList, hocs:[withCurrentUser, [withList, listOptions]]});