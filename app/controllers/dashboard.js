import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  suppliers: [],
  setUp: function(){
    let controller = this;
    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers);
    });
  }
});
