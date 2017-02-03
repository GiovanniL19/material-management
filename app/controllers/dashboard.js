import Ember from 'ember';

export default Ember.Controller.extend({
  suppliers: [],
  setUp: function(){
    let controller = this;
    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers);
    });
  }
});
