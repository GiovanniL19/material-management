import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller){
    document.title = "Dashboard";

    controller.setUp();

    controller.set("application.page",{
      dashboard: true,
      orders: false,
      suppliers: false,
      deliveries: false,
      stock: false,
      orders: false,
      bikes: false
    });
  }
});
