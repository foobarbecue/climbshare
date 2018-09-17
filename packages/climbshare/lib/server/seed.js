import { newMutation } from 'meteor/vulcan:core'
import Crags from '../modules/crags/collection.js'

const seedData = [
  {
    name: "streambed",
    lat: -106.988561,
    lon: 34.005287,
    initialTransform: [1.0, 0.0, 0.0, 0.0,
      0.0, -0.309, -0.951, -4.7312,
      0.0, 0.951, -0.309, 1.6171,
      0.0, 0.0, 0.0, 1.0]
  },
  {
    name: "pecks mystery",
    lat: -106.988561,
    lon: 34.005287,
    initialTransform: [1.0, 0.0, 0.0, 0.0,
      0.0, -0.309, -0.951, -4.7312,
      0.0, 0.951, -0.309, 1.6171,
      0.0, 0.0, 0.0, 1.0]
  }
];

Meteor.startup(()=>{
  if (Crags.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy crags');
    Promise.awaitAll(seedData.map(document => newMutation({
      collection: Crags,
      document,
      validate: false
    })));
  }
});
