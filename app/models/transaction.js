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
  lines: MF.fragmentArray('line', {async: true}),
  transactionID: DS.attr("string"),
  supplier: belongsTo("supplier", {async: true}),
  dateCreated: DS.attr("number"),
  eta: DS.attr("number"),
  status: DS.attr("string", {defaultValue: "PROCESSING"}),
  note: DS.attr("string"),
  orderDateFormatted: function () {
    return moment.unix(this.get("dateCreated")).format("DD/MM/YYYY");
  }.property("dateCreated"),

  etaFormatted: function () {
    return moment.unix(this.get("eta")).format("DD/MM/YYYY HH:mm");
  }.property("eta"),

  canCancel: function(){
    if(moment.unix() > moment.unix(this.get("dateCreated")).add(2, "days")){
      return false;
    }else{
      return true;
    }
  }.property("dateCreated", "eta"),

  etaHuman: function(){
    if(this.get("status") === "DONE") {
      return "DELIVERED";
    }else{
      return moment.unix(this.get("eta")).fromNow();
    }
  }.property("eta", "status")
});
