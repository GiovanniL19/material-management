import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Supplier'}),
  rev: DS.attr("string"),
  name: DS.attr("string"),
  tradingName: DS.attr("string"),
  tradingAddress: DS.attr("string"),
  returnsAddress: DS.attr("string"),
  contactName: DS.attr("string"),
  contactEmail: DS.attr("string"),
  contactNumber: DS.attr("string"),
  status: DS.attr("string", {defaultValue: 'OK'}),
  transactionHistory: DS.hasMany("transactions", {async: true, defaultValue: []}),
  stock: DS.hasMany("item", {async: true, defaultValue: []}),
  terminated: DS.attr("boolean", {defaultValue: false}),
  isOk: function(){
    if(this.get("status") === "OK"){
      return true
    }else{
      return false
    }
  }.property("status"),

  onHold: function(){
    if(this.get("status") === "ON HOLD"){
      return true
    }else{
      return false
    }
  }.property("status"),

  bard: function(){
    if(this.get("status") === "BARD"){
      return true
    }else{
      return false
    }
  }.property("status"),

  canOrder: function(){
    if(this.get("status") === "BARD" || this.get("status") === "ON HOLD"){
      return false;
    }else{
      if(this.get("terminated")){
       return false;
      }else{
        return true;
      }
    }
  }.property("status", "terminated"),
  qualityPerformance: function(){
    var totalPoints = 0;
    var pointsScored = 0;

    this.get("transactionHistory").forEach(function(order){
      order.get("lines").forEach(function(item) {
        totalPoints++;
        if(item.get("isFulfilled")){
          pointsScored++;
        }
      });
    });

    var percentage = pointsScored / totalPoints * 100;
    if(totalPoints === 0){
      return "0%";
    }else{
      return percentage.toFixed(2) + "%";
    }
  }.property("transactionHistory"),
});
