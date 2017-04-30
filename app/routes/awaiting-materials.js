import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('order');
  },
  setupController: function(controller, model) {
    document.title = "Orders Awaiting Materials";
    controller.set("model", model);
    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      bikes: false,
      receivedGoods: false,
      quotations: false,
      awaitingMaterials: true
    });
  }
});
