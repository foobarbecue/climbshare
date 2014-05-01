if (Meteor.isClient) {
   Meteor.subscribe("labels");
   Meteor.subscribe("climbs");
    
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
    Meteor.publish("climbs", function() {
         return Climbs.find();
    });    
    Labels.allow({
        insert: function(user){
            if (user != null){
                return true;
            }
            else{
                return false;
            }
        }
    });
    Climbs.allow({});
    
    Meteor.methods({
    readData: function(){
        for (var boulderName in data.boulders){
            insertBoulder(data.boulders[boulderName]);
            console.log('inserted boulder: ' + boulderName);
            return boulderName
        }        
    }})

}
