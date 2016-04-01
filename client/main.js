import THREE from 'three';
import { Climbsim } from '/imports/startup/client/ui/climbsim.js';
import { Session } from 'meteor/session';
import "/imports/startup/client/routes.js";
import "/imports/startup/client/ui/ui.js";

// // initial variables
// Session.set("selectedLabel", null)
//
// subscriptions
Meteor.subscribe("labels");
Meteor.subscribe("climbs");
Meteor.subscribe("users");

// scene manipulation functions (probably should be in climbsim.js)
// function colorAllClimbsWhite() {
//     $(Climbsim.scene.children).each(function () {
//         if (this instanceof THREE.Line) {
//             this.material.color.set('white');
//         }
//     })
// }

// Handlebars.registerHelper('loadedBoulder',function(input){
//   return Session.get("loadedBoulder");
// });

// template definitions
Template.boulderPage.onRendered(function() {
  this.subscribe("boulders",{onReady:function(){
    Climbsim.init();
    Climbsim.animate();
    menuinit();
  }});
});

Template.controlPanel.helpers({
    labels: function () {
        return Labels.find();
    },
    users: function () {
        return Meteor.users.find();
    },
    models3D: function () {
        $('select').val(Session.get('loadedBoulder'));
        return Boulders.find();
    },
    climbs: function () {
        boulder = Boulders.findOne({
            name: Session.get('loadedBoulder')
        });
        if (typeof boulder !== 'undefined') {
            return Labels.find({
                refers_to_boulder: boulder._id,
                refers_to_type: 'climb'
            });
        }
    },
})

Template.controlPanel.events({
    "change #boulderList": function (e, tmpl) {
        Session.set("loadedBoulder", e.target.value)
    },
    "mouseenter .ctrlPnlClimb": function (e, tmpl) {
        label = Labels.findOne(e.currentTarget.id);
        Session.set("selectedLabel", label._id);
    },
    "change #filterDisplay": function (e){
        var filterInputData = $(e.currentTarget).serializeArray();
        Session.set("filter", filterInputData);
        Deps.flush();
        Climbsim.positionLabelIcons();
    },
    "mousedown #submitClimbshareFeedback": function(){
        if (Meteor.userId()){
            Feedback.insert({
                content:$('#climbshareFeedback textarea').val(),
                createdBy:Meteor.userId(),
                createdOn:TimeSync.serverTime()
            })
            alert("Feedback submitted.")
        }
        else{
            alert("Please log in to submit feedback.")
        }
    }
})
// Template.labels3D.labels = function () {
//     loadedBoulder = Boulders.findOne({
//         name: Session.get('loadedBoulder')
//     });
//     if (typeof (loadedBoulder) !== 'undefined') {
//         return Labels.find({
//             "refers_to_boulder": loadedBoulder._id
//         });
//     };
// }
// Template.labels3D.helpers({
//     labels: function () {
//         boulder = Boulders.findOne({
//             name: Session.get('loadedBoulder')
//         });
// //             // if we don't have a boulder set, no point in showing any labels
//         if (!boulder) {return []};
//         var displayFilterData = Session.get('filter');
//         if (!!displayFilterData){
//             // massage control panel show / hide form data into an array
//             var displayFilterArray = displayFilterData.map(function(obj){return obj.name});
//         }
//         else{
//             // set initial values in case DOM isn't available yet
//             var displayFilterData=[{name:'createdBy',value:'everyone'}]
//             var displayFilterArray=['climb','warning','other'];
//         }
//         if (!!boulder) {
//             // have "other" checkbox control display of labels with no type yet
//             if ($.inArray('other', displayFilterArray) > -1){
//                 displayFilterArray.push(null);
//             }
//             var createdBy = undefined;
//             displayFilterData.forEach(function(obj){
//                 if(obj.name == "createdBy"){
//                     createdBy = obj.value
//                 }})
//             if (!createdBy || createdBy === "everyone"){
//                     createdBy = {$exists:true}
//             }
//             if ($.inArray('climb', displayFilterArray) > -1){
//                 // TODO should share a function with the initial climb loading
//                 Climbs.find({boulder_id:boulder._id}).map(Climbsim.loadClimb);
//             } else {
//                 Climbsim.removeAllClimbs();
//             };
//             return Labels.find({
//                 refers_to_boulder: boulder._id,
//                 refers_to_type: { '$in' : displayFilterArray },
//                 createdBy: createdBy
//             });
//     }},
//     username: function () {
//         var user = Meteor.users.findOne(this.createdBy);
//         if (user) {
//             return user.username || user.profile.name || user.profile.username;
//         } else {
//             return this.createdBy;
//         }
//     },
//     typeIcon: function (){
//         return '/img/'+this.refers_to_type+'.png'
//     },
//     climb: function (){
//         return this.refers_to_type == 'climb'
//     },
//     selected: function (value){
//         if (this.refers_to_type == null && value == 'other'){
//             return 'selected'
//         }
//         else{
//             return (value == this.refers_to_type ? 'selected' : '')
//         }
//     },
//     editable: function (){
//         return this.createdBy === Meteor.userId() ? "true" : "false";
//     }
// });
//
// Template.labels3D.events({
//     'mouseenter .label3D': function (event) {
//         Session.set("selectedLabel", event.currentTarget.id);
//         //             moved to Deps.autorun
//         //             $(event.currentTarget).addClass('selected');
//         //             $(event.currentTarget).children('.hidden').fadeIn();
//     },
//     'mouseleave .label3D': function (event) {
//         console.log($(':focus'))
//         if (!($(':focus').is($('select.labelType')))){
//             Session.set("selectedLabel", undefined);
//         }
//     },
//     'click .deleteButton': function () {
//         var labelId = this._id;
//         var climbId = this.refers_to_id;
//         Labels.remove(labelId);
//         Climbs.remove(climbId);
//     },
//     'input .label3Dcontent': function(event) {
//         event.preventDefault();
//         console.log('changed');
//         if (settings.showTyping){
//             Labels.update(
//             $(event.currentTarget).parents('.label3D').attr('id'),
//             {$set:{content:event.currentTarget.textContent}});
//         }
//     },
//     'keydown .label3Dcontent': function(event){
//         console.log(event.which)
//         // Handle presses of the return key as ending input rather than
//         // starting a new line
//         if (event.which == 13){
//             $(event.currentTarget).blur();
//         Labels.update(
//             $(event.currentTarget).parents('.label3D').attr('id'),
//             {$set:{content:event.currentTarget.textContent}});
//         }
//     },
//     'change .labelType': function(event, tmpl){
//         Labels.update(this._id, {$set:{refers_to_type:event.currentTarget.value}})
//         event.target.blur();
//     }
// })
//
function genLabelAdder(labelType){
    return function(){
        if (Meteor.user() != null){
        labelID=Labels.insert({
            content:'type here',
            position:{
                x:mouse3D.position.x,
                y:mouse3D.position.y,
                z:mouse3D.position.z
            },
            createdBy:Meteor.userId(),
            //TODO Well that's obviously wrong. Same value in two fields.
            createdByName:Meteor.userId(),
            createdOn:TimeSync.serverTime(),
            refers_to_boulder:Boulders.findOne({name:Session.get('loadedBoulder')})._id,
            refers_to_type:labelType
        });
        $("#" + labelID + " .label3Dcontent").focus();
        $("#" + labelID + " .label3Dcontent").selectText();
        }
        else{
            alert('Sign up / log in to add data.')
        }

    }}


tools = []
function Tool(name, icon, effect, tooltip, instructions, showToUser) {
    this.name = name;
    this.icon = icon;
    this.run = effect;
    this.tooltip = tooltip;
    this.instructions=instructions;
    this.showToUser = showToUser;
    if (typeof(showToUser) === 'undefined'){
        this.showToUser=true;
    };
}

tools = {
addNewClimb : new Tool('addNewClimb','/img/addClimb.png', function(){
    // Need to deprecate Climbsim.latestClimb and just store the ID
    // because it's an unnecessary non-reactive manual cache
    Climbsim.latestClimb = Climbs.findOne(Climbsim.addNewClimb());
    Climbsim.latestClimbId = Climbsim.latestClimb._id;
    Climbsim.addLabelForClimb(Climbsim.latestClimb);
    tools.current=tools.addVertexToClimb;
    },
    'Tool: Add climb',
    'Double click to begin, and keep double clicking to draw the climb. Press enter when finished.'
        ),

addVertexToClimb : new Tool('addVertexToClimb','/img/addVertex.png', function(){
    Climbsim.addVertexToClimb(Climbsim.latestClimb);
    Climbsim.loadClimb(Climbsim.latestClimb);
    $(document).on('keydown.finishClimb', function(e){
        if (e.keyCode == 13){
            // delete latest vertex b/c people are "already" finished when the press enter. If statement to deal with bubbling which was causing all vertices to be removed.
            if (tools.current==tools.addVertexToClimb){
                Climbs.update({_id:climb._id}, {$pop: {vertices:1}});
            };
            tools.current=tools.addNewClimb;

            $(this).off('keydown.finishClimb')
        }


    })
    },
    'Double click on the rock to add a new vertex' + Session.get('selectedLabel'),
    '',
    false
),
addWarning : new Tool('addLabel','/img/addWarning.png', genLabelAdder('warning'),
    'Tool: Add warning',
    'Double click on the rock to add a warning.'
),
addBeta : new Tool('addLabel','/img/addBeta.png', genLabelAdder('beta'),
    'Tool: Add beta',
    'Double click on the rock to add beta.'
),
addOther : new Tool('addLabel','/img/addOther.png', genLabelAdder('other'),
    'Tool: Add miscelleneous info',
    'Double click on the rock to add a miscelleneous label.'
),
}
Template.toolbox.helpers({

    tools: tools,
        // maybe rename things to avoid scope confusion
    toolboxTip: function(){
            return Session.get('toolboxTip');
    },
    instructions: function(){
            return Session.get('toolboxInstructions');
    }}
);

Template.registerHelper('key_value', function(context, options) {
  var result = [];
  _.each(context, function(value, key, list){
    result.push({key:key, value:value});
  })
  return result;
});

Template.toolbox.events({
    'change input[name=mouseTool]': function(){
        tools.current=this.value;
        Session.set('toolboxTip', this.value.tooltip);
        Session.set('toolboxInstructions', this.value.instructions);
    }
});

// Load the currently selected 3D boulder model
Deps.autorun(function () {
    try {
        var boulderName = Session.get('loadedBoulder');
        Climbsim.loadBoulder(boulderName);
        $('#boulderList').val(boulderName);
    } catch (TypeError) {
        console.log('failed to load ' + boulderName);
    }
})

Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
    })


