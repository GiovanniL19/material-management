import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller){
    if(this.get('router.url') === "/"){
      controller.transitionToRoute("dashboard");
    }
  }
});
