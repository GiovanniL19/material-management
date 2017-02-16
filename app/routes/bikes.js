import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('bike');
  },
  setupController: function(controller, model) {
    document.title = "Bikes";
    controller.set("model", model);

    controller.set("application.page",{
      dashboard: false,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      orders: false,
      bikes: true,
      receivedGoods: false
    });
  },
  deactivate: function(){
    let controller = this;
    setTimeout(function(){
      controller.controllerFor("bikes").clear();
    },1000);
  }
});
