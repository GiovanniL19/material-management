import Ember from 'ember';

export function lineRequired(params) {

  var quantity = params[1];
  var liveQuantity = params[2];

  if (liveQuantity >= quantity) {
    return false;
  } else {
    return true;
  }
}

export default Ember.Helper.helper(lineRequired);
