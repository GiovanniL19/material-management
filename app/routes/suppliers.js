import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('supplier');
  },
  setupController: function(controller, model){
    document.title = "Suppliers";

    controller.set("model", model);
    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: true,
      deliveries: false,
      stock: false,
      orders: false
    });
  },
  deactivate: function(){
    this.controllerFor("suppliers").clear();
  }
});
