import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Bike'}),
  rev: DS.attr("string"),
  name: DS.attr("string"),
  components: DS.hasMany("item",  {async: true, defaultValue: []}),
  price: DS.attr("number"),
  retail: DS.attr("number"),
  amountSold: DS.attr("number", {defaultValue: 0}),
  assemblyTime: DS.attr("string"),
  quotedQuantity: DS.attr("number", {defaultValue: 0}),

  quantityOnHold: function(){
    var totalOnHold = 0;
    totalOnHold += this.get("quotedQuantity");

    return totalOnHold;
  }.property("quotedQuantity"),
  formattedPrice: function(){
    if(!this.get("price")){
      return '£' + parseFloat(0).toFixed(2);
    }else{
      return '£' + parseFloat(this.get("price")).toFixed(2);
    }
  }.property("price"),
  formattedRetail: function(){
    if(!this.get("retail")){
      return '£' + parseFloat(0).toFixed(2);
    }else{
      return '£' + parseFloat(this.get("retail")).toFixed(2);
    }
  }.property("retail"),

  warehouseStock: function(){
    var stockLevels = [];
    this.get("components").forEach(function(item){
      stockLevels.push(item.get("quantity"));
    });
    return Math.min.apply(Math, stockLevels);
  }.property("components.@each.quantity"),
  quantity: function(){
    var stockLevels = [];
    this.get("components").forEach(function(item){
      stockLevels.push(item.get("quantity"));
    });

    let total = Math.min.apply(Math, stockLevels);
    total -= this.get("quotedQuantity");
    return total;
  }.property("components.@each.quantity", "quotedQuantity"),

  quoteQuantityEmpty: function(){
    if(parseInt(this.get("quoteQuantity")) === 0){
      return true;
    }else{
      return false;
    }
  }.property("quoteQuantity")
});
