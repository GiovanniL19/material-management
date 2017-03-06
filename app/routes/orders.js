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
      orders: true,
      suppliers: false,
      deliveries: false,
      stock: false,
      bikes: false,
      receivedGoods: false,
      quotations: false
    });
  },
  deactivate: function(){
    let controller = this;
    setTimeout(function(){
      controller.controllerFor("orders").clear();
    },1000);
  }
});
