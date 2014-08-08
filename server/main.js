Meteor.publish("labels", function () {
    return Labels.find();
});
Meteor.publish("climbs", function () {
    return Climbs.find();
});
Meteor.publish("boulders", function () {
    return Boulders.find();
});
Meteor.publish("users", function () {
    return Meteor.users.find();
});
Meteor.publish("mice", function () {
    return Mice.find();
});    

usr_owned_perms ={
    insert: function (userId) {
        // only logged in users can create new labels
        return userId != null
    },
    remove: function (userId, obj) {
        return obj.createdBy === userId
    },
    update: function (userId, label) {
        return obj.createdBy === userId
    }
}

Labels.allow(usr_owned_perms);
Climbs.allow(usr_owned_perms);
Mice.allow(usr_owned_perms);
Feedback.allow({
    insert: function(userId){
        // only logged in users can submit feedback
        return userId != null            
    }       
});

Meteor.methods({
    readData: function () {
        for (var name in data.boulders) {
            insertBoulder(data.boulders[name]);
            console.log('inserted boulder: ' + name);
        }
    },
    updateMouse3D: function (mouse3Dpos) {
        var userId = this.userId
        Mice.update(
            {createdBy:userId},
            {createdBy:userId,position:mouse3Dpos,createdOn:new Date()},
            {upsert:true});
    }
})