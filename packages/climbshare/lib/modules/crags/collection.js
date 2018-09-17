import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Crags = createCollection({
  collectionName: 'Crags',
  typeName: 'Crag',
  schema,
  resolvers: getDefaultResolvers('Crags'),
  mutations: getDefaultMutations('Crags'),
  // checkAccess: () => { return true; }
});

Users.groups.guests.can([
  'crags.new'
])

Crags.addDefaultView(terms => {
  return {
    options:{sort:'name'}
  };
});

export default Crags;
