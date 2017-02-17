import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliersController: Ember.inject.controller("suppliers"),
  view: true,
  editMode: false,
  item: null,
  suppliers: [],
  groups: [],
  groupName: null,
  newGroup: false,
  selectedGroup: null,
  selectedSupplier: null,
  sortAsc: ['name:asc'],
  sortedModel: Ember.computed.sort('model', 'sortAsc'),

  reserve: {
    item: null,
    ref: "",
    customerName: "",
    quantity: ""
  },

  onHoldCheck: function(){
    let controller = this;
    if(this.get("model") !== undefined) {
      this.get("model").forEach(function(item) {
        if(item.get("reservedStock")) {
          item.get("reservedStock").forEach(function (onHold) {
            if (onHold.get("been24Hours")) {
              item.get("reservedStock").removeObject(onHold);
              controller.get("activityController").set("On hold stock released for " + controller.get("item.name"));
              item.save();
            }
          });
        }
      });
    }
  }.observes("sortedModel"),
  generateBarcode: function(){
    var barcode = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for(var i = 0; i < 20; i++){
      barcode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return barcode.replace(/\s/g, '').toUpperCase();
  }.property(),

  selectedItem: function(item){
    this.set("item", item);
    this.set("editMode", true);
    this.load();
  },
  clear: function(){
    this.set("view", true);
    if(this.get("item")) {
      if (!this.get("item.id")) {
        this.get("item").deleteRecord();
      }
    }
    this.set("item", null);
    this.set("groupName", null);
    this.set("editMode", false);
    this.set("newGroup", false);
  },
  load: function(){
    let controller = this;
    this.store.findAll("supplier"). then(function(suppliers){
      controller.set("suppliers", suppliers);
      controller.set("selectedSupplier", controller.get('suppliers.firstObject'));

      controller.store.findAll("group"). then(function(groups){
        controller.set("groups", groups);
        controller.set("selectedGroup", controller.get('groups.firstObject'));

        if(controller.get("item.id")){
          controller.set("selectedSupplier", controller.get('item.supplier'));
          controller.set("selectedGroup", controller.get('item.group'));
        }
        controller.set('view', false);
      });
    });
  },
  actions:{
    deleteOnHold: function(onHold) {
      if(confirm("About to release stock")) {
        let controller = this;
        this.get("item.reservedStock").removeObject(onHold);
        this.get("item").save().then(function () {
          controller.set("application.message", "Held Stock Released");
          controller.get("activityController").set("On hold stock released for " + controller.get("item.name"));
        });
      }
    },
    onHoldAccepted: function(onHold) {
      if(confirm("About to update stock levels")) {
        let controller = this;

        //Update stock level
        this.set("item.warehouseQuantity", this.get("item.warehouseQuantity") - onHold.get("quantity"));

        //Remove from on hold
        this.get("item.reservedStock").removeObject(onHold);

        //Update object
        this.get("item").save().then(function () {
          controller.set("application.message", "Held Stock Released");
          controller.get("activityController").set("Stock updated for " + controller.get("item.name"));
        });
      }
    },
    selectItemForReserve: function(item){
      let controller = this;
      this.store.find("item", item).then(function(foundItem){
        controller.set("reserve.item", foundItem);
      });
    },
    reserve: function(){
      let controller = this;
      if(this.get("reserve.customerName") === ""){
        controller.set("application.message", "Please enter customer name");
      }else {
        if (parseInt(this.get("reserve.quantity")) > parseInt(this.get("reserve.item.quantity"))) {
          this.set("application.message", "There is not enough stock to reserve");
        } else {
          var reserve = this.store.createFragment("reserve", {
            ref: controller.get("reserve.ref"),
            customerName: controller.get("reserve.customerName"),
            quantity: controller.get("reserve.quantity"),
            dateReserved: moment().unix()
          });

          this.get("reserve.item.reservedStock").pushObject(reserve);
          this.get("reserve.item").save().then(function () {
            controller.set("application.message", "Selected stock put on hold");
            controller.get("activityController").set("Stock put on hold for " + controller.get("reserve.item.name"));
          });

          this.set("reserve.ref", "");
          this.set("reserve.customerName", "");
          this.set("reserve.quantity", "");
        }
      }
    },
    goToSupplier: function(supplier){
      this.get("suppliersController").selectedItem(supplier);
      this.transitionToRoute("suppliers");
    },
    orderComplete: function(){
      let controller = this;

      this.set("item.warehouseQuantity", this.get("item.warehouseQuantity") - this.get("item.quantityOnHold"));
      this.set("item.quantityOnHold", "");

      this.get("item").save().then(function(){
        controller.set("application.message", "Quantity changed");
      });
    },
    selectGroup: function(group){
      let controller = this;
      this.get("groups").forEach(function(item){
        if(item.get("id") === group){
          controller.set("selectedGroup", item);
        }
      });
    },
    selectSupplier: function(supplier){
      let controller = this;
      this.get("suppliers").forEach(function(item){
        if(item.get("id") == supplier){
          controller.set("selectedSupplier", item);
        }
      });
    },
    toggleNewGroup: function(){
      this.set("newGroup", !this.get("newGroup"));
    },
    new: function(){
      this.load();
      this.set("item", this.store.createRecord("item"));
    },
    back: function(){
      this.clear();
    },

    save: function(){
      let controller = this;
      var supplier = this.get("selectedSupplier");
      var item = this.get("item");

      item.set("barcode", this.get("generateBarcode"));

      if(this.get("newGroup")) {
        var group = this.store.createRecord("group", {
          name: controller.get("groupName"),
        });

        group.save().then(function(savedGroup){
          item.set("supplier", supplier);
          item.set("group", savedGroup);
          //Saved supplier and group id in item
          item.save().then(function(savedItem) {
            //Update group to save item id
            savedGroup.get("items").pushObject(savedItem);
            savedGroup.save().then(function(){
              //Update supplier
              supplier.get("stock").pushObject(savedItem);
              supplier.save().then(function(){
                controller.set("application.message", "Item Saved & Group Added");
                controller.get("activityController").set(savedItem.get("name") + " added to stock");
                controller.get("activityController").set("Group " + savedGroup.get("name") + " has been created");
                controller.clear();
              });
            });
          });
        });
      }else{
        var group = this.get("selectedGroup");

        item.set("supplier", supplier);
        item.set("group", group);
        item.save().then(function(savedItem){
          group.get("items").pushObject(savedItem);
          group.save().then(function(updatedGroup) {
            //Update supplier
            supplier.get("stock").pushObject(savedItem);
            supplier.save().then(function(){
              controller.set("application.message", "Item Saved");
              controller.get("activityController").set(savedItem.get("name") + " added to stock");
              controller.clear();
            });
          });
        });
      }
    },

    delete: function(item){
      if(confirm("You are about to remove "+ item.get("name"))){
        let controller = this;

        this.store.findRecord('supplier', item.get("supplier.id")).then(function(oldSupplier) {
          oldSupplier.get("stock").removeObject(item);
          oldSupplier.save().then(function() {
            controller.store.findRecord('group', item.get("group.id")).then(function (oldGroup) {
              oldGroup.get("items").removeObject(item);
              oldGroup.save().then(function () {
                item.destroyRecord().then(function(){
                  controller.set("application.message", "Item Removed From Stock");
                  controller.get("activityController").set("Item " + item.get("name") + " deleted from stock");
                  controller.clear();
                });
              });
            });
          });
        });
      }
    },

    select: function(item){
      this.selectedItem(item);
    },

    update: function() {
      let controller = this;
      var item = this.get("item");

      this.store.findRecord('supplier', item.get("supplier.id")).then(function(oldSupplier) {
        oldSupplier.get("stock").removeObject(item);
        oldSupplier.save().then(function(){
          controller.store.findRecord('group', item.get("group.id")).then(function(oldGroup) {
            oldGroup.get("items").removeObject(item);
            oldGroup.save().then(function(){
              //UPDATE ITEM

              var supplier = controller.get("selectedSupplier");

              var item = controller.get("item");

              if(controller.get("newGroup")) {
                var group = controller.store.createRecord("group", {
                  name: controller.get("groupName"),
                });

                group.save().then(function(savedGroup){
                  item.set("supplier", supplier);
                  item.set("group", savedGroup);
                  //Saved supplier and group id in item
                  item.save().then(function(savedItem) {
                    //Update group to save item id
                    savedGroup.get("items").pushObject(savedItem);
                    savedGroup.save().then(function(){
                      //Update supplier
                      controller.store.findRecord('supplier', supplier.get("id")).then(function(supplier) {
                        supplier.get("stock").pushObject(savedItem);
                        supplier.save().then(function () {
                          controller.clear();
                          controller.get("activityController").set(savedItem.get("name") + " updated");
                          controller.get("activityController").set("Group " + savedGroup.get("name") + " has been created");
                          controller.set("application.message", "Item Saved & Group Updated");
                        });
                      });
                    });
                  });
                });
              }else{
                var group = controller.get("selectedGroup");

                item.set("supplier", supplier);
                item.set("group", group);
                item.save().then(function(savedItem){
                  controller.store.findRecord('group', group.get("id")).then(function(group) {
                    group.get("items").pushObject(savedItem);

                    group.save().then(function(updatedGroup) {
                      //Update supplier
                      controller.store.findRecord('supplier', supplier.get("id")).then(function(supplier) {
                        supplier.get("stock").pushObject(savedItem);
                        supplier.save().then(function(){
                          controller.clear();
                          controller.get("activityController").set(savedItem.get("name") + " updated");
                          controller.set("application.message", "Item Saved");
                        });
                      });
                    });
                  });
                });
              }
            });
          });
        });
      });
    }
  }
});
