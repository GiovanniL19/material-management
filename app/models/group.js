import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Group'}),
  rev: DS.attr("string"),
  name: DS.attr("string"),
  items: DS.hasMany("item",  {async: true, defaultValue: []})
});
