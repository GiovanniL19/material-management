import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

const {
  fragmentArray
} = MF;

export default Model.extend({
  type: attr("string", {defaultValue: 'Item'}),
  rev: attr("string"),
  barcode: attr("string"),

  //Details
  name: attr("string"),
  description: attr("string"),

  //Quantity
  warehouseQuantity: attr("number"),
  minQuantity: attr("number"),
  reOrderQty: attr("number"),
  quotedQuantity: attr("number", {defaultValue: 0}),
  reservedStock: fragmentArray("reserve"),

  //Prices
  trade: attr("number"),
  retail: attr("number"),

  //Groups, suppliers and bikes
  group: belongsTo("group", {async: true}),
  supplier: belongsTo("supplier", {async: true}),
  bikes: hasMany("bike", {async: true, defaultValue: []}),

  //Delivery
  leadTime: attr("string"),

  //Computed Properties
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
