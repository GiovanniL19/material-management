import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';
import moment from 'moment';

const {
  attr,
  belongsTo
} = DS;

const {
  fragmentArray
} = MF;

export default Model.extend({
  type: attr("string", {defaultValue: 'transaction'}),
  lines: fragmentArray('line-fragment', {async: true}),
  transactionID: attr("string"),
  supplier: belongsTo("supplier", {async: true}),
  dateCreated: attr("number"),
  eta: attr("number"),
  status: attr("string", {defaultValue: "PROCESSING"}),
  note: attr("string"),
  totalCost: attr("string"),
  rejectDelivery: attr("boolean"),

  //Computed Properties
  totalHuman: function(){
    return '£' + parseFloat(this.get("totalCost")).toFixed(2);
  }.property("totalCost"),
  formattedTotal: function(){
    let total = 0;
    this.get("lines").forEach(function(item) {
      if (item.get("checked")) {
        var cost = 0;
        if(item.get("newQuantity")) {
          item.set("quantity", item.get("newQuantity"));
          cost = item.get("quantity") * item.get("price");
          item.set("total", cost);
          total += cost;
        }else{
          cost = item.get("quantity") * item.get("price");
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
      return "MISSING ITEMS";
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
