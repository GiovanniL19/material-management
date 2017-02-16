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

  orderDateFormatted: function () {
    return moment.unix(this.get("dateCreated")).format("DD/MM/YYYY");
  }.property("dateCreated"),

  etaFormatted: function () {
    return moment.unix(this.get("eta")).format("DD/MM/YYYY HH:mm");
  }.property("eta"),

  canCancel: function(){
    if(moment.unix() > moment.unix(this.get("dateCreated")).add(2, "days")){
      return false;
    }else{
      return true;
    }
  }.property("dateCreated", "eta"),

  etaHuman: function(){
    if(this.get("status") === "DONE") {
      return "DELIVERED";
    }else{
      return moment.unix(this.get("eta")).fromNow();
    }
  }.property("eta", "status")
});
