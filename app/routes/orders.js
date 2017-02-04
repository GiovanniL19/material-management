import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('transaction');
  },
  setupController: function(controller, model) {
    document.title = "Orders";
    controller.set("model", model);
    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      orders: true,
      bikes: false
    });
  },
  deactivate: function(){
    this.controllerFor("orders").clear();
  }
});
