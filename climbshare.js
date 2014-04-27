if (Meteor.isClient) {
   Meteor.subscribe("labels");
    
   Template.controlPanel.labels = function() {
       return Labels.find();
   }
   Template.labels3D.labels = function() {
       return Labels.find();
   }
}

if (Meteor.isServer) {
    Meteor.publish("labels", function() {
        return Labels.find();
    });
    Labels.allow();
}
