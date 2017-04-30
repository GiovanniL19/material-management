import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany
} = DS;

const {
  fragmentArray
} = MF;
export default Model.extend({
  type: attr("string", {defaultValue: 'Order'}),
  orders: hasMany('order', {async: true, defaultValue: []}),
  bikeType: attr("string"),
  parts: fragmentArray("part-fragment")
});
