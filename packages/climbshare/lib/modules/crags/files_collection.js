import { FilesCollection } from 'meteor/ostrio:files';

export const CragFiles = new FilesCollection({
  collectionName: 'cragfiles',
  config:{
    storagePath:''
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('cragfiles.all');
}

if (Meteor.isServer) {
  Meteor.publish('cragfiles.all', function () {
    return CragFiles.find().cursor;
  });
}
