import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  stock: Ember.inject.controller(),
  activityController: Ember.inject.controller(),
  suppliersController: Ember.inject.controller("suppliers"),
  view: true,
  editMode: false,
  quote: null,
  sortDesc: ['dateCreated:desc'],
  sortedModel: Ember.computed.sort('model', 'sortDesc'),
  allStock: [],
  allBikes: [],

  total: function(){
    var total = 0;
    if(this.get("quote")) {
      let controller = this;
      this.get("allStock").forEach(function (item) {
        if (item.get("checked")) {
          controller.get("quote.stockLines").forEach(function (line) {
            if (item.get("name") === line.get("name")) {
              line.set("quantity", item.get("quoteQuantity"));
              var cost = line.get("quantity") * line.get("price");
              line.set("total", cost);
              total += cost;
            }
          });
        }
      });

      this.get("allBikes").forEach(function (item) {
        if (item.get("checked")) {
          controller.get("quote.bikeLines").forEach(function (line) {
            if (item.get("name") === line.get("name")) {
              line.set("quantity", item.get("quoteQuantity"));
              var cost = line.get("quantity") * line.get("price");
              line.set("total", cost);
              total += cost;
            }
          });
        }
      });

      this.set("quote.totalCost", total);
    }
    return '£' + parseFloat(total).toFixed(2);
  }.property("quote.stockLines.length", "quote.bikeLines.length", "allStock.@each.quoteQuantity", "allBikes.@each.quoteQuantity"),

  generateQuotationID: function(){
    var id = "";
    let characters = moment.unix() + "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

    for(var i = 0; i < 10; i++){
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return ("UK" + id).replace(/\s/g, '').toUpperCase();
  }.property(),

  load: function(){
    let controller = this;
    controller.set("view", false);
    this.get("allStock").forEach(function(item){
      item.set("checked", false);
      item.set("quoteQuantity", 0);
    });
  },
  clear: function(){
    if(this.get("quote")) {
      if (!this.get("quote.id")) {
        this.get("quote").deleteRecord();
      }
      this.get("allStock").forEach(function(item){
        item.set("checked", false);
        item.set("orderQuantity", 0);
      });

      this.get("allBikes").forEach(function(item){
        item.set("checked", false);
        item.set("orderQuantity", 0);
      });
    }
    this.set("view", true);
    this.set("quote", null);
    this.set("editMode", false);
  },
  selectedItem: function(quote){
    this.set("quote", quote);
    this.set("view", false);
    this.set("editMode", true);
    this.load();
  },
  deleteQuote: function(quote){
    let controller = this;
    if(confirm("You are about to delete quote " + quote.get("quoteID"))){
      quote.get("stockLines").forEach(function(line){
        controller.store.find("item", line.get("item")).then(function(item){
          //Add the quantity to the item quotedQuantity property
          item.set("quotedQuantity", item.get("quotedQuantity") - line.get("quantity"));
          item.save();
        });
      });

      quote.get("bikeLines").forEach(function(line){
        controller.store.find("bike", line.get("item")).then(function(bike){
          //Add the quantity to the item quotedQuantity property
          bike.set("quotedQuantity", bike.get("quotedQuantity") - line.get("quantity"));
          bike.save();
        });
      });

      controller.get("activityController").set("Quote " + quote.get("quoteID") + " deleted");
      quote.destroyRecord().then(function(){
        controller.set("application.message", "Quote has been deleted");
        controller.clear();
      });
    }
  },
  actions:{
    delete: function(quote){
      this.deleteQuote(quote);
    },
    createQuote: function(){
      let controller = this;
      if(this.get("quote.customerName") && this.get("quote.customerNumber") && this.get("quote.customerEmail")) {
        if (this.get("quote.lines.length") !== 0) {
          this.set("quote.quoteID", this.get("generateQuotationID"));
          this.set("quote.dateCreated", moment().unix());
          this.get("quote").save().then(function (savedQuote) {
            savedQuote.get("stockLines").forEach(function(line){
              controller.store.find("item", line.get("item")).then(function(item){
                //Add the quantity to the item quotedQuantity property
                item.set("quotedQuantity", item.get("quotedQuantity") + line.get("quantity"));
                item.save();
              });
            });

            savedQuote.get("bikeLines").forEach(function(line){
              controller.store.find("bike", line.get("item")).then(function(bike){
                //Add the quantity to the item quotedQuantity property
                bike.set("quotedQuantity", bike.get("quotedQuantity") + line.get("quantity"));
                bike.save();
              });
            });
            controller.set("application.message", "Quote created");
            controller.get("activityController").set("Quote" + savedQuote.get("transactionID") + " created");
            controller.clear();
          });
        } else {
          this.set("application.message", "To create a quote, you need to add at least one line");
        }
      }else{
        this.set("application.message", "Please fill in customer information");
      }
    },
    selectLine: function(type, item) {
      let controller = this;
      if(item.get("quoteQuantity") > 0) {
        if (!controller.get("editMode")) {
          if (item.get("checked")) {
            this.get("quote." + type + "Lines").forEach(function (line) {
              if (item.get("name") === line.get("name")) {
                controller.get("quote." + type + "Lines").removeObject(line);
                item.set("checked", false);
              }
            });
          } else {
            let newFragmentLine = this.store.createFragment("line", {
              name: item.get("name"),
              quantity: item.get("quoteQuantity"),
              item: item.get("id"),
              price: item.get("retail")
            });

            this.get("quote." + type + "Lines").pushObject(newFragmentLine);
            item.set("checked", true);
          }
        } else {
          item.set("checked", !item.get("checked"));
        }
      }else{
        this.set("application.message", "Quantity can not be 0 or less");
      }
    },
    new: function(){
      this.load();
      this.set("quote", this.store.createRecord("quote"));
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
