import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliers: [],
  activities: [],
  setUp: function(){
    let controller = this;

    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers.toArray().reverse());
      controller.store.findAll("activity").then(function(activities){
        controller.set("activities", activities.toArray().reverse());
      });
    });
  },
  actions: {
    deleteActivity: function(activity){
      if(confirm("You are about to remove this activity")){
        this.get("activities").removeObject(activity);
        activity.destroyRecord();
      }
    }
  }
});
