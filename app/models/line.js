import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  name: DS.attr("string"),
  quantity: DS.attr("number"),
  item: DS.attr("string"),
  price: DS.attr("number"),
  total: DS.attr("number"),
  receivedQuantity: DS.attr("number"),

  addedToStock: DS.attr("number", {defaultValue: 0}),

  formattedTotal: function(){
    let total = this.get("price") * this.get("quantity");
    return '£' + parseFloat(total).toFixed(2);
  }.property("price", "quantity"),
  formattedPrice: function(){
    return '£' + parseFloat(this.get("price")).toFixed(2);
  }.property("price"),
  isFulfilled: function(){
    if(this.get("quantity") == this.get("receivedQuantity")){
      return true;
    }else{
      return false;
    }
  }.property("quantity", "receivedQuantity"),
  isComplete: DS.attr("boolean", {defaultValue: false})
});
