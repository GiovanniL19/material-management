import DS from 'ember-data';
import MF from 'model-fragments';
import moment from 'moment';

const {
  attr
} = DS;

export default MF.Fragment.extend({
  orderID:  attr("string"),
  customerName:  attr("string"),
  quantity: attr("number"),
  dateReserved: attr("number"),

  been24Hours: function(){
    if(parseInt(moment().add(1, "days").unix()) > parseInt(this.get("dateReserved"))){
      return false;
    }else{
      return true;
    }
  }.property("dateReserved")
});
