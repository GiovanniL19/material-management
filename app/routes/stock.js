import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('item');
  },
  setupController: function(controller, model) {
    document.title = "Stock";

    controller.set("model", model);
    controller.set("application.page", {
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: true,
      orders: false
    });
  },
  deactivate: function(){
    this.controllerFor("stock").clear();
  }
});
