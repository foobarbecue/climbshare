import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';

const Crags = createCollection({
  collectionName: 'Crags',
  typeName: 'Crag',
  schema,
  resolvers: getDefaultResolvers('Crags'),
  mutations: getDefaultMutations('Crags'),
});

export default Crags;
