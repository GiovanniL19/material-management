import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliersController: Ember.inject.controller("suppliers"),
  sortDesc: ['dateCreated:desc'],
  sortedModel: Ember.computed.sort('model', 'sortDesc'),
  view: true,


  clear: function(){
    this.set("view", true);
    this.set("transaction", null);
  },
  selectedItem: function(transaction){
    this.set("transaction", transaction);
    this.set("view", false);
  },

  actions:{
    clearReceivedQuantity: function(line){
      line.set("receivedQuantity", 0);
    },
    updateSystem: function(){
      if(confirm("You are about to update stock in the system")) {
        let controller = this;
        this.get("transaction.lines").forEach(function (line) {
          let received = 0;
          if(line.get("receivedQuantity") > line.get("addedToStock")){
           received = parseInt(line.get("receivedQuantity") - line.get("addedToStock"));
          }else{
            received = line.get("addedToStock") - parseInt(line.get("receivedQuantity"));
          }

          if(line.get("addedToStock") === 0){
            console.log("stock is 0 so setting it to received quantity");
            line.set("addedToStock", parseInt(line.get("receivedQuantity")));
          }

          var stock = parseInt(line.get("addedToStock"));
          var non = false;
          if(parseInt(line.get("receivedQuantity")) === 0){
            non = true;
          }else{
            non = false;
          }
          controller.store.find("item", line.get("item")).then(function(item){
            if(non){
              item.set("warehouseQuantity", (parseInt(item.get("warehouseQuantity")) - stock));
            }else {
              if (received < stock) {
                item.set("warehouseQuantity", (parseInt(item.get("warehouseQuantity")) - received));
              } else {
                item.set("warehouseQuantity", (parseInt(item.get("warehouseQuantity")) + received));
              }
            }

            if (line.get("isFulfilled")) {
              line.set("isComplete", true);
              item.set("status", "DELIVERED");
              controller.set("transaction.status", "DELIVERED");
            }else{
              controller.set("transaction.status", "MISSING ITEMS");
              item.set("status", "DELIVERED WITH MISSING ITEMS");
            }
            item.save();
          });

          if(line.get("addedToStock") !== 0){
            console.log("Updating added stock");
            line.set("addedToStock", parseInt(line.get("receivedQuantity")));
          }
        });

        this.get("transaction").save().then(function () {
          controller.set("application.message", "Saved");
        });
      }
    },
    goToSupplier: function(supplier){
      this.get("suppliersController").selectedItem(supplier);
      this.transitionToRoute("suppliers");
    },
    select: function(transaction){
      this.selectedItem(transaction);
    },
    back: function(){
      this.clear();
    },
  }

});
