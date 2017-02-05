import Ember from 'ember';

export default Ember.Controller.extend({
  orders: Ember.inject.controller(),
  suppliers: Ember.inject.controller(),
  stock: Ember.inject.controller(),
  bikes: Ember.inject.controller(),
  searchInput: "",
  searchMode: false,
  supplierResults: [],
  itemResults: [],
  orderResults: [],
  bikeResults: [],
  close: function(){
    this.set("searchInput", "");
    this.set("searchMode", false);
    this.set("supplierResults", []);
    this.set("itemResults", []);
    this.set("orderResults", []);
    this.set("bikeResults", []);
  },
  search: function(){
    let controller = this;
    this.set("searchMode", true);

    this.set("supplierResults", []);
    this.set("itemResults", []);
    this.set("orderResults", []);
    this.set("bikeResults", []);

    //Suppliers
    this.store.query('supplier',  {
      filter: {
        type: "Supplier",
        name: controller.get("searchInput")
      }
    }).then(function(supplierResults){
      controller.get("supplierResults").addObjects(supplierResults);
    });

    //Items
    this.store.query('item',  {
      filter: {
        type: "Item",
        name: controller.get("searchInput")
      }
    }).then(function(itemResults){
      controller.get("itemResults").addObjects(itemResults);
    });

    this.store.query('item',  {
      filter: {
        type: "Item",
        barcode: controller.get("searchInput")
      }
    }).then(function(itemResults){
      controller.get("itemResults").addObjects(itemResults);
    });

    //Orders
    this.store.query('transaction',  {
      filter: {
        type: "Transaction",
        transactionID: controller.get("searchInput")
      }
    }).then(function(orderResults){
      controller.get("orderResults").addObjects(orderResults);
    });


    //Orders
    this.store.query('bike',  {
      filter: {
        type: "Bike",
        name: controller.get("searchInput")
      }
    }).then(function(bikeResults){
      controller.get("bikeResults").addObjects(bikeResults);
    });


  }.observes("searchInput"),
  actions:{
    goTo: function(option, object){
      this.close();
      switch(option){
        case "supplier":
          this.get("suppliers").selectedItem(object);
          this.transitionToRoute("suppliers");
          break;
        case "item":
          this.get("stock").selectedItem(object);
          this.transitionToRoute("stock");
          break;
        case "order":
          this.get("orders").selectedItem(object);
          this.transitionToRoute("orders");
          break;
        case "bike":
          this.get("bikes").selectedItem(object);
          this.transitionToRoute("suppliers");
          break;
      }
    },
    doSearch: function(){
      this.search();
    },
    closeSearch: function(){
      this.close();
    },
    goToOrders: function(){
      this.get("orders").clear();
      this.transitionToRoute("orders");
    }
  }
});
