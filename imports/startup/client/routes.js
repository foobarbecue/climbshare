import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/:area/:boulder', {
  action: function () {
    console.log('routed');
    BlazeLayout.render("mainLayout", {content: "boulderPage"});
  }
});