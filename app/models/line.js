import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr
} = DS;
export default MF.Fragment.extend({
  name: attr("string"),
  quantity: attr("number"),
  item: attr("string"),
  price: attr("number"),
  total: attr("number"),
  receivedQuantity: attr("number"),
  addedToStock: attr("number", {defaultValue: 0}),
  isComplete: attr("boolean", {defaultValue: false}),

  //Computed properties
  formattedTotal: function(){
    let total = this.get("price") * this.get("quantity");
    return '£' + parseFloat(total).toFixed(2);
  }.property("price", "quantity"),
  formattedPrice: function(){
    return '£' + parseFloat(this.get("price")).toFixed(2);
  }.property("price"),
  isFulfilled: function(){
    if(this.get("quantity") === this.get("receivedQuantity")){
      return true;
    }else{
      return false;
    }
  }.property("quantity", "receivedQuantity")
});
