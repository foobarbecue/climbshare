if (Meteor.isClient) {
    // initial variables
    Session.set("selectedLabel",null)
    
    // subscriptions
    Meteor.subscribe("labels");
    Meteor.subscribe("climbs");
    Meteor.subscribe("boulders");
//     Meteor.subscribe("users");
   
    // template definitions
    Template.controlPanel.labels = function() {
        return Labels.find();
    }
    Template.controlPanel.models3D = function() {
        return Boulders.find();
    }

    Template.labels3D.labels = function(requestedUserId) {
        return Labels.find({'createdBy':requestedUserId});
    }
    Template.labels3D.events({
        'mouseenter .label3D': function(event) {
            Session.set("selectedLabel", event.currentTarget.id);
            $(event.currentTarget).addClass('selected');
            $('.label3Ddetails').fadeIn();  
        },
        'mouseleave .label3D': function(event) {
            $(event.currentTarget).removeClass('selected');
            $('.label3Ddetails').fadeOut();
        }
    })
    Template.label3Ddetails.label = function(){
        try{return Labels.findOne(Session.get("selectedLabel"))}
        catch(TypeError){return null}
    }   
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
    })
    }

if (Meteor.isServer) {
    Meteor.publish("labels", function() {
         return Labels.find();
    });
    Meteor.publish("climbs", function() {
         return Climbs.find();
    });  
    Meteor.publish("boulders", function() {
         return Boulders.find();
    });      
/*    Meteor.publish("users", function() {
         return Users.find();
    });*/    
    Labels.allow({
        insert: function(userId){
            // only logged in users can create new labels
            return userId != null
        },
        remove: function(userId, label){
            return label.createdBy === userId
        },
        update: function(userId, label){
            return label.createdBy === userId
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