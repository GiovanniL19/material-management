import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';
import moment from 'moment';
s
const {
  attr
} = DS;

const {
  fragmentArray
} = MF;

export default Model.extend({
  type: attr("string", {defaultValue: 'Quote'}),
  rev: attr("string"),
  bikeLines: fragmentArray('line', {async: true}),
  stockLines: fragmentArray('line', {async: true}),

  quoteID: attr("string"),

  dateCreated: attr("number"),
  note: attr("string"),

  totalCost: attr("string"),
  confirmedQuote: DS.attr("boolean"),

  customerName: attr("string"),
  customerEmail: attr("string"),
  customerNumber: attr("string"),

  //Computed Properties
  totalFormatted: function(){
    let total = 0;
    this.get("stockLines").forEach(function(item) {
      var cost = item.get("quantity") * item.get("price");
      item.set("total", cost);
      total += cost;
    });

    this.get("bikeLines").forEach(function(item) {
      var cost = item.get("quantity") * item.get("price");
      item.set("total", cost);
      total += cost;
    });

    return '£' + parseFloat(total).toFixed(2);
  }.property("bikeLines.@each.newQuantity", "stockLines.@each.newQuantity"),
  createdDateFormatted: function () {
    return moment.unix(this.get("dateCreated")).format("DD/MM/YYYY");
  }.property("dateCreated"),
  etaFormatted: function () {
    return moment.unix(this.get("eta")).format("DD/MM/YYYY");
  }.property("eta"),
});
