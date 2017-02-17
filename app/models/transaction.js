import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Transaction'}),
  rev: DS.attr("string"),
  lines: MF.fragmentArray('line', {async: true}),
  transactionID: DS.attr("string"),
  supplier: belongsTo("supplier", {async: true}),
  dateCreated: DS.attr("number"),
  eta: DS.attr("number"),
  status: DS.attr("string", {defaultValue: "PROCESSING"}),
  note: DS.attr("string"),
  totalCost: DS.attr("string"),
  rejectDelivery: DS.attr("boolean"),
  totalHuman: function(){
    return '£' + parseFloat(this.get("totalCost")).toFixed(2);
  }.property("totalCost"),
  formattedTotal: function(){
    let total = 0;
    this.get("lines").forEach(function(item) {
      if (item.get("checked")) {
        if(item.get("newQuantity")) {
          item.set("quantity", item.get("newQuantity"));
          var cost = item.get("quantity") * item.get("price");
          item.set("total", cost);
          total += cost;
        }else{
          var cost = item.get("quantity") * item.get("price");
          item.set("total", cost);
          total += cost;
        }
      }
    });
    return '£' + parseFloat(total).toFixed(2);
  }.property("lines.@each.newQuantity"),

  formattedOrderedTotal: function(){
    let total = 0;
    this.get("lines").forEach(function(item) {
      var cost = item.get("quantity") * item.get("price");
      item.set("total", cost);
      total += cost;
    });

    return '£' + parseFloat(total).toFixed(2);
  }.property("lines.@each.newQuantity"),
  rawOrderedTotal: function(){
    let total = 0;
    this.get("lines").forEach(function(item) {
      var cost = item.get("quantity") * item.get("price");
      total += cost;
    });

    return total;
  }.property("lines.@each.newQuantity"),

  orderDateFormatted: function () {
    return moment.unix(this.get("dateCreated")).format("DD/MM/YYYY");
  }.property("dateCreated"),

  etaFormatted: function () {
    return moment.unix(this.get("eta")).format("DD/MM/YYYY");
  }.property("eta"),


  canCancel: function(){
    if(moment(Date.now()).unix() > moment.unix(this.get("dateCreated")).add(2, "days").unix()){
      return false;
    }else{
      if(this.get("status") === "PROCESSING"){
        return true;
      }else {
        return false;
      }
    }
  }.property("dateCreated", "eta"),

  etaHuman: function(){
    if(this.get("status") === "DELIVERED") {
      return "DELIVERED";
    }else if(this.get("status") === "MISSING ITEMS") {
      return "MISSING ITEMS"
    }else{
      return moment.unix(this.get("eta")).fromNow();
    }
  }.property("eta", "status"),

  isComplete: function(){
    if(this.get("status") === "DELIVERED") {
      return true;
    }else{
      return false;
    }
  }.property("status"),

  isMissingItems: function(){
    if(this.get("status") === "MISSING ITEMS") {
      return true;
    }else{
      return false;
    }
  }.property("status"),

  isProcessing: function(){
    if(this.get("status") === "PROCESSING") {
      return true;
    }else{
      return false;
    }
  }.property("status")

});
