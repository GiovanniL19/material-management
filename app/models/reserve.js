import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  orderID:  DS.attr("string"),
  customerName:  DS.attr("string"),
  quantity: DS.attr("number")
});
