import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  view: true,
  order: null,
  items: [],

  clear: function(){
    this.set("view", true);
    this.set("transaction", null);
    this.set("editMode", false);
  },
  selectedItem: function(order){
    this.set("order", order);
    this.get("order.manifest.parts").forEach(function(item){
      item.set("checked", true);
      item.set("newQuantity", "");
    });

    this.set("view", false);
    this.set("editMode", true);
  },

  addLiveQuantityToPart: function(){
    let controller = this;
    this.get("model").forEach(function(order){
      order.set("missingItems", false);
      order.get("manifest").then(function(manifest){
        manifest.get("parts").forEach(function(part){
          controller.get("items").forEach(function(item){
            if(item.get("quantity") !== undefined) {
              if(!(item.get("quantity") >= part.get("quantity"))) {
               order.set("missingItems", true);
              }
              part.set("liveQuantity", item.get("quantity"));
            }else{
              order.set("missingItems", true);
            }
          });
        });
      });
    });
  }.observes("model", "application.page", "items"),

  actions: {
    fulfilled(order){
      let controller = this;

      order.set("status", "In Production");
      order.save().then(function(){

        controller.set("application.message", "Updating Material Quantities");
        order.get("manifest.parts").forEach(function(part){
          controller.get("items").forEach(function(item){
            item.set("warehouseQuantity", item.get("warehouseQuantity") - part.get("quantity"));
            item.save();
          });
        });

        controller.get("model").removeObject(order);
        controller.set("application.message", "Manifest Fulfilled");
      });
    },
    select: function(order){
      this.selectedItem(order);
    },
    back: function(){
      this.clear();
    },
  }
});
