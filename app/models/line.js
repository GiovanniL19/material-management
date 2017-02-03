import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  name: DS.attr("string"),
  quantity: DS.attr("number"),
  item: DS.belongsTo("item")
});
