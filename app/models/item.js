import Model from 'ember-pouch/model';
import DS from 'ember-data';

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
  quantity: DS.attr("number"),
  minQuantity: DS.attr("number"),
  quantityOnHold: DS.attr("number"),
  trade: DS.attr("number"),
  retail: DS.attr("number"),
  group: DS.belongsTo("group", {async: true}),
  supplier: DS.belongsTo("supplier", {async: true}),
  bikes: DS.hasMany("bike", {async: true, defaultValue: []}),

  lowStock: function(){
    let min = this.get('minQuantity') + 5;
    if(this.get('quantity') < min){
      return true;
    }else{
      return false;
    }
  }.property("minQuantity", "quantity"),

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
