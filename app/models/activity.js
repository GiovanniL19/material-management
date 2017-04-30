import Model from 'ember-pouch/model';
import DS from 'ember-data';
import moment from 'moment';

const {
  attr,
} = DS;

export default Model.extend({
  type: attr("string", {defaultValue: "Activity"}),
  time: attr("number"),
  result: attr("string"),

  //Computed Properties
  timeFormatted: function(){
    return moment.unix(this.get("time")).fromNow();
  }.property("time")
});
