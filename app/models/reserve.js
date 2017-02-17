import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  orderID:  DS.attr("string"),
  customerName:  DS.attr("string"),
  quantity: DS.attr("number"),
  dateReserved: DS.attr("number"),
  been24Hours: function(){
    if(parseInt(moment().add(1, "days").unix()) > parseInt(this.get("dateReserved"))){
      return false;
    }else{
      return true;
    }
  }.property("dateReserved")
});
