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

  quantityOnHold: function(){
    var totalOnHold = 0;
    this.get("reservedStock").forEach(function(reserve) {
      totalOnHold += reserve.get("quantity");
    });

    return totalOnHold;
  }.property("reservedStock.@each.quantity"),
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
});
