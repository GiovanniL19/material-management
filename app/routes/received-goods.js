import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('transaction');
  },
  setupController: function(controller, model) {
    document.title = "Received Goods";
    controller.set("model", model);
    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      orders: false,
      bikes: false,
      receivedGoods: true
    });
  },
  deactivate: function(){
    let controller = this;
    setTimeout(function(){
      controller.controllerFor("received-goods").clear();
    },1000);
  }
});
