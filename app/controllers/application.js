import Ember from 'ember';

export default Ember.Controller.extend({
  page: {
    dashboard: true,
    orders: false,
    suppliers: false,
    deliveries: false,
    stock: false,
    orders: false
  },
  message: "",
  messageObserver: function(){
    let controller = this;
    setTimeout(function(){
      controller.set("message", "");
    },5000);
  }.observes("message")
});
