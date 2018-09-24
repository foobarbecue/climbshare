import { registerFragment } from 'meteor/vulcan:core';

registerFragment(/* GraphQL */`
  fragment ClimbFormFragment on Climb {
    _id
    climbType
    difficulty
  }
`);
