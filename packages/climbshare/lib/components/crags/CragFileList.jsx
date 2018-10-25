import React from 'react';
import { Link } from 'react-router';
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core';
import CragFiles from '../../modules/crags/files_collection.js';

const CragFileList = ({results = []}) => {
  return <div className={"crag-list"}>
    {results.map(crag =>
      <div key={'file' + key}>
        <Components.CragFileDisp />
      </div>
    )}
    <Components.ModalTrigger label="Upload">
      <Components.CragsNewForm />
    </Components.ModalTrigger>
  </div>
};


const listOptions = {
  collection: CragFiles
};

registerComponent({name:'CragFileList', component: CragList, hocs:[withCurrentUser, [withList, listOptions]]});
