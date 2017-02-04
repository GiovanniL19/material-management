import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  view: true,
  editMode: false,
  item: null,
  suppliers: [],
  groups: [],
  groupName: null,
  newGroup: false,
  selectedGroup: null,
  selectedSupplier: null,

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
    if(this.get("item")) {
      if (!this.get("item.id")) {
        this.get("item").deleteRecord();
      }
    }
    this.set("view", true);
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
                  controller.get("activityController").set("Deleted " + item.get("name"));
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
                          controller.set("application.message", "Item Saved & Group Added");
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
