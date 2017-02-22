import Model from 'ember-pouch/model';
import DS from 'ember-data';
import MF from 'model-fragments';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  type: DS.attr("string", {defaultValue: 'Quote'}),
  rev: DS.attr("string"),
  bikeLines: MF.fragmentArray('line', {async: true}),
  stockLines: MF.fragmentArray('line', {async: true}),

  quoteID: DS.attr("string"),

  dateCreated: DS.attr("number"),
  note: DS.attr("string"),

  totalCost: DS.attr("string"),
  confirmedQuote: DS.attr("boolean"),

  customerName: DS.attr("string"),
  customerEmail: DS.attr("string"),
  customerNumber: DS.attr("string"),

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
