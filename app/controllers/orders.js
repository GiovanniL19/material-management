import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  stock: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  view: true,
  editMode: false,
  transaction: null,
  selectedSupplier: null,
  suppliers: [],
  sentSupplier: null,
  sortDesc: ['dateCreated:desc'],
  sortedModel: Ember.computed.sort('model', 'sortDesc'),

  generateTransactionID: function(){
    var id = "";
    let characters = moment.unix() + this.get("selectedSupplier.name");

    for(var i = 0; i < 10; i++){
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return ("UK" + id).replace(/\s/g, '').toUpperCase();
  }.property(),
  total: function(){
    var total = 0;
    if(this.get("selectedSupplier") && this.get("transaction")) {
      let controller = this;
      this.get("selectedSupplier.stock").forEach(function (item) {
        if (item.get("checked")) {
          controller.get("transaction.lines").forEach(function (line) {
            if (item.get("name") === line.get("name")) {
              line.set("quantity", item.get("orderQuantity"));
              var cost = line.get("quantity") * line.get("price");
              line.set("total", cost);
              total += cost;
            }
          });
        }
      });
      this.set("transaction.totalCost",total);
    }
    return '£' + parseFloat(total).toFixed(2);
  }.property("transaction.lines.length", "selectedSupplier.stock.@each.orderQuantity"),
  load: function(){
    let controller = this;

    this.store.findAll("supplier").then(function(suppliers){
      controller.set("suppliers", suppliers);
      if(controller.get("sentSupplier") !== null){
        controller.set("selectedSupplier", controller.get('sentSupplier'));
      }else{
        suppliers.forEach(function(supplier){
          if(supplier.get("canOrder") === true){
            controller.set("selectedSupplier", supplier);
          }
        });
      }
      controller.set("view", false);
    });
  },
  clear: function(){
    if(this.get("transaction")) {
      if (!this.get("transaction.id")) {
        this.get("transaction").deleteRecord();
      }
      this.get("selectedSupplier.stock").forEach(function(item){
        item.set("checked", false);
        item.set("orderQuantity", "");
      });
    }
    this.set("view", true);
    this.set("transaction", null);
    this.set("editMode", false);
    this.set("suppliers", []);
  },
  selectedItem: function(transaction){
    this.set("transaction", transaction);
    this.get("transaction.lines").forEach(function(item){
      item.set("checked", true);
      item.set("newQuantity", "");
    });
    this.set("view", false);
    this.set("editMode", true);
    this.load();
  },
  deleteTransaction: function(transaction){
    let controller = this;
    if(confirm("You are about to cancel order " + transaction.get("transactionID"))){
      this.store.findRecord('supplier', transaction.get("supplier.id")).then(function(supplier) {
        supplier.get("transactionHistory").removeObject(transaction);
        supplier.save().then(function(){
          controller.get("activityController").set("Order " + transaction.get("transactionID") + " canceled");
          transaction.destroyRecord().then(function(){
            controller.set("application.message", "Order has been canceled");
            controller.clear();
          });
        });
      });
    }
  },
  actions:{
    update: function(){
      let controller = this;
      var updatedLines = [];

      var containLines = false;
      this.get("transaction.lines").forEach(function(line) {
        if (line.get("checked") === true) {
          containLines = true;
        }
      });

      if(!containLines) {
        this.deleteTransaction(this.get("transaction"));
      }else{
        var total = 0;
        this.get("transaction.lines").forEach(function(line){
          if(line.get("checked") === true){
            var newLine = controller.store.createFragment("line",{
              name: line.get("name"),
              item: line.get("item"),
              price: line.get("price")
            });

            if(line.get("newQuantity") !== 0){
              newLine.set("quantity", line.get("newQuantity"));
            }else{
              newLine.set("quantity", line.get("quantity"));
            }

            newLine.set("total", line.get("price") * newLine.get("quantity"));
            updatedLines.pushObject(newLine);
            total += newLine.get("total");
          }
        });
        this.set("transaction.totalCost", total);
        this.set("transaction.lines", updatedLines);
        this.get("transaction").save().then(function(){
          controller.get("transaction.lines").forEach(function(line) {
            line.set("checked", true);
          });

          controller.get("activityController").set("Order " + controller.get("transaction.transactionID") + " has been updated");
          controller.set("application.message", "Order has been updated");

        });
      }
    },
    placeOrder: function(){
      let controller = this;
      if(this.get("transaction.lines.length") !== 0){
        this.set("transaction.supplier", controller.get("selectedSupplier"));
        this.set("transaction.transactionID", this.get("generateTransactionID"));
        this.set("transaction.dateCreated", moment().unix());
        this.set("transaction.eta", moment().add(5, "days").unix());
        this.get("transaction").save().then(function(savedTransaction){
          controller.get("selectedSupplier.transactionHistory").pushObject(savedTransaction);
          controller.get("selectedSupplier").save().then(function(){
            controller.set("application.message", "Order has been placed");
            controller.get("activityController").set("Order " + savedTransaction.get("transactionID") + " created");
            controller.clear();
          });
        });
      }else{
        this.set("application.message", "To create an order, you need to add at least one line");
      }
    },
    delete: function(transaction){
      this.deleteTransaction(transaction);
    },
    addItem: function(){
      this.get("stock").load();
      this.transitionToRoute("stock");
    },
    selectLine: function(item){
      let controller = this;

      if(!controller.get("editMode")){
        if(item.get("checked")){
          this.get("transaction.lines").forEach(function(line){
            if(item.get("name") === line.get("name")){
              controller.get("transaction.lines").removeObject(line);
              item.set("checked", false);
            }
          });
        }else {
          let newFragmentLine = this.store.createFragment("line", {
            name: item.get("name"),
            quantity: item.get("orderQuantity"),
            item: item,
            price: item.get("trade")
          });

          this.get("transaction.lines").pushObject(newFragmentLine);
          item.set("checked", true);
        }
      }else{
        item.set("checked", !item.get("checked"));
      }
    },
    selectSupplier: function(supplier){
      let controller = this;
      this.get("suppliers").forEach(function(item){
        if(item.get("id") === supplier){
          item.get("stock").forEach(function(line){
            line.set("checked", false);
            line.set("orderQuantity", "");
          });

          controller.set("selectedSupplier", item);
        }
      });
    },
    new: function(){
      this.load();
      this.set("transaction", this.store.createRecord("transaction"));
      this.set("view", false);
    },
    back: function(){
      this.clear();
    },
    select: function(transaction){
      this.selectedItem(transaction);
    }
  }
});
