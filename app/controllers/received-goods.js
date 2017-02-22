import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliersController: Ember.inject.controller("suppliers"),
  orders: Ember.inject.controller(),
  sortDesc: ['dateCreated:desc'],
  sortedModel: Ember.computed.sort('model', 'sortDesc'),
  view: true,
  numberOfAccepted: 0,
  numberOfRejected: 0,
  numberWithMissing: 0,
  numberNotDelivered: 0,

  count: function(){
    let controller = this;
    this.get("model").forEach(function(delivery){
      if(delivery.get("rejectDelivery")){
        controller.set("numberOfRejected", controller.get("numberOfRejected") + 1);
      }else if(delivery.get("isComplete")){
        controller.set("numberOfAccepted", controller.get("numberOfAccepted") + 1);
      }else if(delivery.get("isMissingItems")){
        controller.set("numberWithMissing", controller.get("numberWithMissing") + 1);
      }else if(delivery.get("isProcessing")){
        controller.set("numberNotDelivered", controller.get("numberNotDelivered") + 1);
      }
    })
  }.observes("model"),
  clear: function(){
    this.set("view", true);
    this.set("transaction", null);
  },
  selectedItem: function(transaction){
    this.set("transaction", transaction);
    this.set("view", false);
  },

  actions:{
    rejectDelivery: function(transaction){
      let controller = this;

      if(confirm("You are about to reject this delivery")) {
        transaction.set("rejectDelivery", true);
        transaction.set("status", "REJECTED");
        transaction.save().then(function () {
          controller.set("application.message", "Delivery was rejected");
        });
      }
    },
    goToOrder: function(transaction){
      this.get("orders").selectedItem(transaction);
      this.transitionToRoute("orders");
    },
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
              controller.get("activityController").set(controller.get("transaction.transactionID") + " has been delivered");
            }else{
              controller.set("transaction.status", "MISSING ITEMS");
              controller.get("activityController").set(controller.get("transaction.transactionID") + " has missing items");
              item.set("status", "DELIVERED WITH MISSING ITEMS");
            }
            controller.get("transaction").save();
            item.save();
          });

          if(line.get("addedToStock") !== 0){
            console.log("Updating added stock");
            line.set("addedToStock", parseInt(line.get("receivedQuantity")));
          }
        });
        controller.set("application.message", "Saved");
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
