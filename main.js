

if (Meteor.isClient) {

    // initial variables
    Session.set("selectedLabel",null)
    
    // subscriptions
    Meteor.subscribe("labels");
    Meteor.subscribe("climbs");
    Meteor.subscribe("boulders");
    Meteor.subscribe("users");
   
    // template definitions
    Template.controlPanel.labels = function() {
        return Labels.find();
    }
    Template.controlPanel.users = function() {
        return Meteor.users.find();
    }
    Template.controlPanel.models3D = function() {
        $('select').val(Session.get('loadedBoulder'));
        return Boulders.find();
    }
    Template.controlPanel.events({
        "change #boulderList":function(e, tmpl) {
            Session.set("loadedBoulder",e.target.value)
    }})

    Template.labels3D.labels = function(requestedUserId) {
        return Labels.find();
    }
    Template.labels3D.events({
        'mouseenter .label3D': function(event) {
            Session.set("selectedLabel", event.currentTarget.id);
            $(event.currentTarget).addClass('selected');
            $(event.currentTarget).children('div').fadeIn();
        },
        'mouseleave .label3D': function(event) {
            $(event.currentTarget).removeClass('selected');
            $(event.currentTarget).children('div').fadeOut();
        }
    })

    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
    })
    
    Meteor.startup(function(){
        climbsimInit();
        climbsimAnimate();
    boulderLoaderComputation=Deps.autorun(function(){
        try{
            boulderName = Session.get('loadedBoulder');
            loadBoulder(boulderName);
        }
        catch(TypeError){
            console.log('failed to load '+boulderName)
        }
    })
    Session.set('loadedBoulder','Streambed')
    }
    )
    
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
    Meteor.publish("users", function() {
         return Meteor.users.find();
    });
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
        for (var name in data.boulders){
            insertBoulder(data.boulders[name]);
            console.log('inserted boulder: ' + name);
        }        
    }})

}