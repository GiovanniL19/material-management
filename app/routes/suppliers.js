import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('supplier');
  },
  setupController: function(controller, model){
    controller.set("model", model);

    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: true,
      deliveries: false,
      stock: false
    });
  }
});
