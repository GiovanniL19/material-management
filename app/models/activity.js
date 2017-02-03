import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  rev: DS.attr("string"),
  time: DS.attr("number"),
  result: DS.attr("string"),

  timeFormatted: function(){
    return moment.unix(this.get("time")).format("DD/MM/YYYY HH:mm");
  }.property("time")
});
