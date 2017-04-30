import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  belongsTo
} = DS;

export default Model.extend({
  type: attr("string", {defaultValue: 'Order'}),
  transactionID: attr("string"),
  bikeType: attr("string"),
  status: attr("string"),
  dateCreated: attr("number"),
  eta: attr("number"),
  customer: attr("string"),
  manifest: belongsTo('manifest', {async: true}),

  orderDateFormatted: function () {
    return moment.unix(this.get("dateCreated")).format("DD/MM/YYYY");
  }.property("dateCreated"),
  etaFormatted: function () {
    return moment.unix(this.get("eta")).format("DD/MM/YYYY");
  }.property("eta")
});
