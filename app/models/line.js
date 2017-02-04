import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  type: DS.attr("string", {defaultValue: "Line"}),
  name: DS.attr("string"),
  quantity: DS.attr("number"),
  item: DS.belongsTo("item"),
  price: DS.attr("number"),
  total: DS.attr("number"),
  formattedTotal: function(){
    let total = this.get("price") * this.get("quantity");
    return '£' + parseFloat(total).toFixed(2);
  }.property("price", "quantity"),

  formattedPrice: function(){
    return '£' + parseFloat(this.get("price")).toFixed(2);
  }.property("price")

});
