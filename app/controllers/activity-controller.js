import Ember from 'ember';

export default Ember.Controller.extend({
  set: function(result){
    let activity = this.store.createRecord("activity", {
      "time": moment().unix(),
      "result": result
    });

    activity.save();
  }
});
