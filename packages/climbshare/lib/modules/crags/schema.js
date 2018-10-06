
const schema = {
  _id: {
    type: String,
    canRead: ['guests'],
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (crag, args, context) => {
        return context.Users.findOne(
          { _id: crag.userId },
          {
            fields: context.Users.getViewableFields(
              context.currentUser,
              context.Users
            ),
          }
        );
      },
      addOriginalField: true,
    },
  },
  name: {
    label: 'Name',
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  lat: {
    label: 'Latitude',
    type: Number,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  lon: {
    label: 'Longitude',
    type: Number,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  initialTransform:{ // does this need permissions and stuff?
    type: Array,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  'initialTransform.$': {
    type: Number
  },
  modelFilename:{
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  modelFilenameLoRes:{
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
  },
  climbs: {
    type: Object,
    canRead: ['guests'],
    resolveAs: {
      fieldName: 'climbs',
      type: '[Climb]',
      resolver: (crag, args, context) => {
        return context.Climbs.find({cragName:crag.name}).fetch();
      },
      addOriginalField: true
    }
  }
};

export default schema;
