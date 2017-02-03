import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Transaction'}),
  rev: DS.attr("string"),
  lines: MF.fragmentArray('line', {async: true})
});
