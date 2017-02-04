import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  type: DS.attr("string", {defaultValue: "Line"}),
  name: DS.attr("string"),
  quantity: DS.attr("number"),
  item: DS.belongsTo("item")
});
