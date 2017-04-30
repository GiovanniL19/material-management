import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    this.store.findAll('group');
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
      bikes: false,
      receivedGoods: false,
      quotations: false,
      awaitingMaterials: false
    });

    controller.set("reserve.item", controller.get("sortedModel.firstObject"));
  },
  deactivate: function(){
    let controller = this;
    setTimeout(function(){
      controller.controllerFor("stock").clear();
    },1000);
  }
});
