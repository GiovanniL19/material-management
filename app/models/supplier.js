import Model from 'ember-pouch/model';
import DS from 'ember-data';

PouchDB.debug.enable('*');

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Supplier'}),
  rev: DS.attr("string"),
  name: DS.attr("string"),
  tradingName: DS.attr("string"),
  tradingAddress: DS.attr("string"),
  returnsAddress: DS.attr("string"),
  contact: DS.attr("string"),
  status: DS.attr("string"),
  transactionHistory: DS.hasMany("transactions", {async: true, defaultValue: []})
});
