/**
 * Created by aaron on 3/31/16.
 */
FlowRouter.route('/:area/:boulder', {
  action: function () {
    BlazeLayout.render("mainLayout", {content: "boulderPage"});
  }
});