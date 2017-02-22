import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Item'}),
  rev: DS.attr("string"),
  barcode: DS.attr("string"),
  name: DS.attr("string"),
  warehouseQuantity: DS.attr("number"),
  minQuantity: DS.attr("number"),
  trade: DS.attr("number"),
  retail: DS.attr("number"),
  group: DS.belongsTo("group", {async: true}),
  supplier: DS.belongsTo("supplier", {async: true}),
  bikes: DS.hasMany("bike", {async: true, defaultValue: []}),
  reservedStock: MF.fragmentArray("reserve"),
  leadTime: DS.attr("string"),
  reOrderQty: DS.attr("number"),
  quotedQuantity: DS.attr("number", {defaultValue: 0}),

  quantityOnHold: function(){
    var totalOnHold = 0;
    this.get("reservedStock").forEach(function(reserve) {
      totalOnHold += reserve.get("quantity");
    });
    totalOnHold += this.get("quotedQuantity");

    return totalOnHold;
  }.property("reservedStock.@each.quantity", "quotedQuantity"),
  lowStock: function(){
    let min = this.get('minQuantity') + 5;
    if(this.get('warehouseQuantity') < min){
      return true;
    }else{
      return false;
    }
  }.property("minQuantity", "warehouseQuantity"),

  quantity: function(){
    return this.get("warehouseQuantity") - this.get("quantityOnHold");
  }.property("quantityOnHold", "warehouseQuantity"),

  formattedRetail: function(){
    return '£' + parseFloat(this.get("retail")).toFixed(2);
  }.property("retail"),
  formattedTrade: function(){
    return '£' + parseFloat(this.get("trade")).toFixed(2);
  }.property("trade"),

  //Used for ordering
  formattedTotal: function(){
    let total = this.get("trade") * this.get("orderQuantity");
    if(total){
      return '£' + parseFloat(total).toFixed(2);
    }else{
      return '£0';
    }
  }.property("orderQuantity"),

  orderQuantityEmpty: function(){
    if(parseInt(this.get("orderQuantity")) === 0){
      return true;
    }else{
      return false;
    }
  }.property("orderQuantity"),
  quoteQuantityEmpty: function(){
    if(parseInt(this.get("quoteQuantity")) === 0){
      return true;
    }else{
      return false;
    }
  }.property("quoteQuantity")
});
