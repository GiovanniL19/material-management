import DS from 'ember-data';
import MF from 'model-fragments';


const {
  attr
} = DS;

export default MF.Fragment.extend({
  part: attr("string"),
  quantity: attr("number"),
  item: attr("string")
});
