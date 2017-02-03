import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('item');
  },
  setupController: function(controller, model) {
    controller.set("model", model);

    controller.set("application.page", {
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: true
    });
  },
  deactivate: function(){
    this.controllerFor("stock").clear();
  }
});
