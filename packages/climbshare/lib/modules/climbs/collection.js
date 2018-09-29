import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Climbs = createCollection({
  collectionName: 'Climbs',
  typeName: 'Climb',
  schema,
  resolvers: getDefaultResolvers('Climbs'),
  mutations: getDefaultMutations('Climbs'),
  // checkAccess: () => { return true; }
});

Users.groups.members.can([
  'climb.create',
  'climb.edit.own',
  'climb.update.own'
]);

Climbs.addDefaultView(terms => {
  return {
    selector:{cragId:terms.cragId},
    options:{sort:'name'}
  };
});

export default Climbs;
