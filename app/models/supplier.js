import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

export default Model.extend({
  type: attr("string", {defaultValue: 'Supplier'}),
  rev: attr("string"),
  name: attr("string"),
  tradingName: attr("string"),
  tradingAddress: attr("string"),
  returnsAddress: attr("string"),
  contactName: attr("string"),
  contactEmail: attr("string"),
  contactNumber: attr("string"),
  status: attr("string", {defaultValue: 'OK'}),
  transactionHistory: hasMany("transactions", {async: true, defaultValue: []}),
  stock: hasMany("item", {async: true, defaultValue: []}),
  terminated: attr("boolean", {defaultValue: false}),

  //Computed properties
  isOk: function(){
    if(this.get("status") === "OK"){
      return true;
    }else{
      return false;
    }
  }.property("status"),
  onHold: function(){
    if(this.get("status") === "ON HOLD"){
      return true;
    }else{
      return false;
    }
  }.property("status"),
  bard: function(){
    if(this.get("status") === "BARD"){
      return true;
    }else{
      return false;
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
