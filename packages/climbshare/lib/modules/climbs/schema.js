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
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
  },
  vertices:{
    type: Array,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    optional: true,
    hidden:true
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
    hidden: true
  },
  cragId: {
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
    canUpdate: ['guests'],
    hidden: true
  }
};

export default schema;
