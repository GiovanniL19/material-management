import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  name: DS.attr("string"),
  groupID: DS.attr("string"),
  quantity: DS.attr("number"),
  minQuantity: DS.attr("number"),
  placedOnHold: DS.attr("number"),
  supplier: DS.belongsTo("supplier")
});
