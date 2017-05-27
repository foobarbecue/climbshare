import "../models.js"

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
Labels.allow({
    insert: function (userId) {
        // only logged in users can create new labels
        return userId != null
    },
    remove: function (userId, label) {
        return label.createdBy === userId
    },
    update: function (userId, label) {
        return label.createdBy === userId
    }
});
Climbs.allow({
    insert: function(userId){
        return userId != null
    },
    remove: function (userId, climb) {
        return climb.createdBy === userId
    },
    update: function (userId, climb) {
        return climb.createdBy === userId
    }
});
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
    }
});