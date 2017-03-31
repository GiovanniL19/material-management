import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

export default Model.extend({
  type: attr("string", {defaultValue: 'group'}),
  name: attr("string"),
  items: hasMany("item",  {async: true, defaultValue: []})
});
