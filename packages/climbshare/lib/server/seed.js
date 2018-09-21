import { newMutation } from 'meteor/vulcan:core'
import Crags from '../modules/crags/collection.js'
import Climbs from '../modules/climbs/collection.js'

const seedCrags = [
  {
    name: "streambed",
    lat: -106.988561,
    lon: 34.005287,
    initialTransform: [1.0, 0.0, 0.0, 0.0,
      0.0, -0.309, -0.951, -4.7312,
      0.0, 0.951, -0.309, 1.6171,
      0.0, 0.0, 0.0, 1.0],
    modelFilename: "streambed.nxz",
    modelFilenameLoRes: "streambed-lores.ply"
  },
  {
    name: "pecks mystery",
    lat: -106.988561,
    lon: 34.005287,
    initialTransform: [1.0, 0.0, 0.0, 0.0,
      0.0, -0.309, -0.951, -4.7312,
      0.0, 0.951, -0.309, 1.6171,
      0.0, 0.0, 0.0, 1.0],
    modelFilename: "pecksm.nxz",
    modelFilenameLoRes: "pecksm-lores.ply"
  }
];

const seedClimbs = [
  {
    name: "Right Roof",
    climbType: "prob",
    difficulty: "V3",
    cragName: "streambed",
    vertices: [
      [
        -6.741744,
        1.987208,
        2.180861
      ],
      [
        -6.619035,
        1.23921,
        2.984409
      ],
      [
        -6.731589,
        0.466374,
        3.441104
      ],
      [
        -7.651319,
        -0.0111,
        3.29476
      ],
      [
        -7.596357,
        -0.482435,
        3.572817
      ],
      [
        -7.532446,
        -0.632361,
        4.077475
      ]]
  },
  {
  name: "High Traverse",
    climbType: "prob",
    difficulty: "V0",
    cragName: "streambed",
    vertices: [
    [
      -8.1331,
      2.3991,
      2.1283
    ],
    [
      -7.3049,
      2.0491,
      2.1549
    ],
    [
      -6.57,
      2.0297,
      2.1826
    ],
    [
      -5.7287,
      1.9393,
      2.3515
    ],
    [
      -4.6431,
      1.3953,
      2.4479
    ],
    [
      -3.9536,
      1.5641,
      2.3141
    ],
    [
      -2.9244,
      1.8086,
      2.3706
    ],
    [
      -2.4849,
      1.3548,
      2.2645
    ],
    [
      -2.0879,
      1.0406,
      2.5954
    ],
    [
      -1.923,
      0.8997,
      2.7008
    ],
    [
      -1.1326,
      1.0474,
      2.726
    ],
    [
      -0.4144,
      1.0322,
      3.0123
    ],
    [
      0.3403,
      0.6526,
      3.3326
    ],
    [
      0.5276,
      0.5859,
      3.0281
    ],
    [
      1.619,
      0.8135,
      3.2384
    ],
    [
      1.8595,
      0.7847,
      3.0898
    ],
    [
      2.9673,
      1.3327,
      3.4341
    ],
    [
      3.511,
      1.3371,
      3.7208
    ],
    [
      4.8594,
      1.76,
      3.6113
    ],
    [
      6.5083,
      2.1257,
      2.8593
    ],
    [
      8.2383,
      1.7283,
      2.9792
    ],
    [
      8.8162,
      1.7948,
      3.1062
    ],
    [
      9.7377,
      2.2094,
      2.6696
    ],
    [
      11.2987,
      2.3514,
      2.2821
    ],
    [
      13.6834,
      2.9888,
      2.0057
    ]
  ]
}
];

Meteor.startup(()=>{
  if (Crags.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy crags');
    seedCrags.map(document => newMutation({
      collection: Crags,
      document,
      // validate: false
    }));
  }
  if (Climbs.find().fetch().length === 0) {
    console.log('// creating dummy climbs');
    seedClimbs.map(document => {
      document.cragId = Crags.findOne({name:document.cragName})._id;
      console.log(document);
      newMutation({
        collection: Climbs,
        document,
        validate: false
      });
    });
  }
  }
);
