import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  suppliers: [],
  activty: [],
  setUp: function(){
    let controller = this;

    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers.toArray().reverse());
    });

    this.store.findAll("activity").then(function(activity){
      controller.set("activity", activity.toArray().reverse());
    });
  }
});
