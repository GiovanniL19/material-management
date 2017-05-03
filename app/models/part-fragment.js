import DS from 'ember-data';
import MF from 'model-fragments';


const {
  attr,
  belongsTo
} = DS;

export default MF.Fragment.extend({
  part: attr("string"),
  quantity: attr("number"),
  item: belongsTo("item", {async: true})
});
