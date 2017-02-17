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
      orders: false,
      bikes: false,
      receivedGoods: false
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
