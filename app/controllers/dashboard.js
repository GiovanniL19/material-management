import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  stock: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliers: [],
  activities: [],
  lowStock: [],
  setUp: function(){
    let controller = this;

    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers.toArray().reverse());
      controller.store.findAll("activity").then(function(activities){
        controller.set("activities", activities.toArray().reverse());

        controller.set("lowStock", []);
        controller.store.findAll("item").then(function(stock){
          stock.forEach(function(item){
            if(item.get("lowStock")){
              controller.get("lowStock").pushObject(item);
            }
          });
        });
      });
    });
  },
  actions: {
    selectStockItem: function(item){
      this.get("stock").selectedItem(item);
      this.transitionToRoute("stock");
    },
    deleteActivity: function(activity){
      if(confirm("You are about to remove this activity")){
        this.get("activities").removeObject(activity);
        activity.destroyRecord();
      }
    }
  }
});
