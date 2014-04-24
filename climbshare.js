if (Meteor.isClient) {
   // client code is all in ./client/climbsim.js right now
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
