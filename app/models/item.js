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
  group: DS.belongsTo("group", {async: true}),
  supplier: DS.belongsTo("supplier", {async: true}),

  lowStock: function(){
    let min = this.get('minQuantity') + 5;
    if(this.get('quantity') < min){
      return true;
    }else{
      return false;
    }
  }.property("minQuantity", "quantity")
});
