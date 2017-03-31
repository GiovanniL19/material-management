import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  set: function(result){
    let activity = this.store.createRecord("activity", {
      "time": moment().unix(),
      "result": result
    });

    activity.save();
  }
});
