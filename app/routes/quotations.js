import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('quote');
  },
  setupController: function(controller, model) {
    controller.set("model", model);
    document.title = "Quotations";

    let stock = this.store.findAll('item');
    let bikes = this.store.findAll('bike');

    controller.set("allStock", stock);
    controller.set("allBikes", bikes);

    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      orders: false,
      bikes: false,
      receivedGoods: false,
      quotations: true
    });
  },
  deactivate: function(){
    let controller = this;
    setTimeout(function(){
      controller.controllerFor("quotations").clear();
    },1000);
  }
});
