if (Meteor.isClient) {
   Meteor.subscribe("labels");
    
   Template.controlPanel.labels = function() {
       return Labels.find();
   }
   Template.labels3D.labels = function() {
       return Labels.find();
   }
   Template.labels3D.climbs= function() {
       return Climbs.find();
   }   
}

if (Meteor.isServer) {
    Meteor.publish("labels", function() {
         return Labels.find();
    });
    Labels.allow({});
//     Climbs.allow({
//         insert:function(){return true},
//         update:function(){return true}
//     });
    
    // add climbs to 
    for (var boulderName in data.boulders){
        insertBoulder(data.boulders[boulderName]);
        console.log('inserted boulder' + boulderName)
    }
}
