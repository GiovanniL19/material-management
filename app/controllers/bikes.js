import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  bike: null,
  view: true,
  editMode: false,
  stock: [],
  bikeCost: 0,
  sortAsc: ['name:asc'],
  sortedModel: Ember.computed.sort('model', 'sortAsc'),

  clear: function(){
    if(this.get("bike")) {
      if (!this.get("bike.id")) {
        this.get("bike").deleteRecord();
      }
    }

    this.get("stock").forEach(function(item){
      item.set("checked", false);
    });
    this.set("bikeCost", 0);
    this.set("view", true);
    this.set("bike", null);
    this.set("editMode", false);
  },

  load: function() {
    let controller = this;

    this.store.findAll("item").then(function (stock) {
      controller.set("stock", stock);
      controller.set('view', false);
    });
  },
  selectedItem: function(bike){
    this.set("bike", bike);
    this.set("view", false);
    this.set("editMode", true);
    this.load();
  },
  deleteBike: function(bike){
    let controller = this;
    if(confirm("You are about to delete " + bike.get("name"))){
      bike.get("components").then(function(components){
        components.forEach(function(item){
          controller.store.findRecord('item', item.get("id")).then(function(item) {
            item.get("bikes").removeObject(bike);
            item.save();
          });
        });
        let bikeName = bike.get("name");
        bike.destroyRecord().then(function(){
          controller.set("application.message", "Bike Deleted");
          controller.get("activityController").set(bikeName + " deleted");
          controller.clear();
        });
      });
    }
  },
  actions: {
    sold: function(){
      let controller = this;
      var bike = this.get("bike");
      if(confirm("You are about update stock levels")){
        bike.get("components").then(function(components){
          components.forEach(function(item){
            controller.store.findRecord('item', item.get("id")).then(function(item) {
              item.set("quantity", item.get("quantity") - 1);
              item.save();
            });
          });
          bike.set("amountSold", bike.get("amountSold") + 1);
          bike.save().then(function(){
            controller.set("application.message", "Bike Sold, you have " + bike.get("quantity") + " left");
            controller.get("activityController").set(bike.get("name") + " sold");
          });
        });
      }
    },
    delete: function(bike){
      this.deleteBike(bike);
    },
    createBike: function(){
      let controller = this;
      if(this.get("bike.name") && this.get("bike.retail") && this.get("bike.components.length") !== 0 && this.get("bike.assemblyTime")){
        this.get("bike").save().then(function(savedBike){
          savedBike.get("components").forEach(function(item){
            item.get("bikes").pushObject(savedBike);
            item.save();
          });
          controller.set("application.message", "Bike Saved");
          controller.get("activityController").set("Bike " + savedBike.get("name") + " created");
          controller.clear();
        });
      }else{
        controller.set("application.message", "Please fill all required fields and be sure to select the bike components");
      }
    },
    selectLine: function(item){
      let controller = this;

      if(!controller.get("editMode")){
        if(item.get("checked")){
          controller.get("bike.components").removeObject(item);
          this.set("bikeCost", this.get("bikeCost") - item.get("trade"));
          item.set("checked", false);
        }else {
          this.get("bike.components").pushObject(item);
          this.set("bikeCost", this.get("bikeCost") + item.get("trade"));
          item.set("checked", true);
        }
        this.set("bike.price", this.get("bikeCost"));
      }else{
        item.set("checked", !item.get("checked"));
      }
    },
    new: function(){
      this.load();
      this.set("bike", this.store.createRecord("bike"));
    },
    back: function(){
      this.clear();
    },
    select: function(bike){
      this.selectedItem(bike);
    }
  }
});
