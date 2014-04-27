if (Meteor.isClient) {
   Template.controlPanel.labels = function() {
       return Labels.find();
   }
   Template.labels3D.labels = function() {
       return Labels.find();
   }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Labels.find().count() == 0) {
        Labels.insert({
            'content':'This is label content',
            'position':{
                'x':-0.49109,
                'y':0.3798,
                'z':0.9137}
        })
    }
  });
}
