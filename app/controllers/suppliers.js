import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  view: true,
  editMode: false,
  supplier: null,
  actions:{
    new: function(){
      this.set("supplier", this.store.createRecord("supplier"));
      this.set("view", false);
    },
    back: function(){
      this.get("supplier").deleteRecord();
      this.set("editMode", false);
      this.set("view", true);
    },
    save: function(){
      let controller = this;
      if(controller.get("supplier.name") && controller.get("supplier.tradingName") && controller.get("supplier.tradingAddress") && controller.get("supplier.contact")){

        if(controller.get("supplier.returnsAddress") === ""){
          controller.set("supplier.returnsAddress", controller.get("supplier.tradingAddress"));
        }

        this.get("supplier").save().then(function(){
          controller.set("application.message", "Success!");
          controller.set("view", true);
        });
      }
      else{
        controller.set("application.message", "Please fill in all required fields");
      }
    },
    delete: function(supplier){
      if(confirm("You are about to remove "+ supplier.get("name"))){
        let controller = this;
        supplier.destroyRecord().then(function(){
          controller.set("application.message", "Supplier Removed");
        });
      }
    },
    select: function(supplier){
      this.set("editMode", true);
      this.set('view', false);
      this.set("supplier", supplier);
    },
    update: function(){
      let controller = this;
      if(controller.get("supplier.name") && controller.get("supplier.tradingName") && controller.get("supplier.tradingAddress") && controller.get("supplier.contact")) {
        this.get("supplier").save().then(function () {
          controller.set("application.message", "Updated Supplier");
          controller.set("editMode", false);
        });
      }else{
        controller.set("application.message", "Please fill in all required fields");
      }
    }
  }
});
