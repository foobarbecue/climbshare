// const vertexSchema = {
//   x:{type: Number},
//   y:{type: Number},
//   z:{type: Number}
// };

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
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  climbType: {
    label: 'Type of climb',
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    input: 'select',
    options: [
      {label: 'boulder problem', type: 'prob'},
      {label: 'trad pitch', type: 'trad'},
      {label: 'sport pitch', type: 'sport'},
      {label: 'mixed', type: 'mixed'},
    ]
  },
  difficulty: {
    type: String
  },
  vertices:{
    type: Array,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
  },
  'vertices.$': {
    type: Array,
    minCount: 3,
    maxCount: 3
  },
  'vertices.$.$': {
    type: Number
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
  },
  cragName:{
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
  },
  cragId: {
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    resolveAs: {
      fieldName: 'crag',
      type: 'Crag',
      resolver: (climb, args, context) => {
        console.log(climb);
        return context.Crags.findOne({ name: climb.cragName })._id
      },
      addOriginalField: true
    }
  }
};

export default schema;
