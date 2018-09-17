// For a vulcanjs schema, this is minimal, but I feel it is extremely cluttered.
// Vulcanjs schemas don't even work unless you have canCreate and canUpdate on
// at least one field.

const schema = {
  _id: {
    type: String,
    canRead: ['guests'],
    optional: true,
  },
  name: {
    label: 'Name',
    type: String,
    canRead: ['guests'],
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
  lat: {
    label: 'Latitude',
    type: Number,
    canRead: ['guests'],
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
  lon: {
    label: 'Longitude',
    type: Number,
    canRead: ['guests'],
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
  initialTransform:{ // does this need permissions and stuff?
    type: Array,
    canRead: ['guests'],
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
  'initialTransform.$': {
    type: Number
  },
  model3D:{
    type: String,
    canRead: ['guests'],
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
  createdAt: {
    type: Date,
    optional: true,
    canCreate: ['members'],
    canUpdate: ['members']
  },
};

export default schema;
