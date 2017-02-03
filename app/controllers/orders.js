import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  view: true,
  editMode: false,
  transaction: null,
  selectedSupplier: null,
  suppliers: [],
  load: function(){
    let controller = this;
    this.store.findAll("supplier"). then(function(suppliers){
      controller.set("suppliers", suppliers);
      controller.set("selectedSupplier", controller.get('suppliers.firstObject'));

      if(controller.get("item.id")){
        controller.set("selectedSupplier", controller.get('item.supplier'));
      }
    });
  },
  clear: function(){
    if(this.get("transaction")) {
      if (!this.get("transaction.id")) {
        this.get("transaction").deleteRecord();
      }
    }
    this.set("view", true);
    this.set("transaction", null);
    this.set("editMode", false);
  },

  actions:{
    selectLine: function(item){
      let controller = this;
      if(item.get("checked")){
        this.get("transaction.lines").forEach(function(line){
          if(item.get("name") === line.get("name")){
            controller.get("transaction.lines").removeObject(line);
            item.set("checked", false);
          }
        });
      }else{
        let newFragmentLine = this.store.createFragment("line",{
          name: item.get("name"),
          quantity: item.get("orderQuantity"),
          item: item
        });

        this.get("transaction.lines").pushObject(newFragmentLine);
        item.set("checked", true);
      }
    },
    selectSupplier: function(supplier){
      let controller = this;
      this.get("suppliers").forEach(function(item){
        if(item.get("id") == supplier){
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
  }
});
