import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard');
  this.route('suppliers');
  this.route('stock');
  this.route('orders');
  this.route('bikes');
  this.route('search');
});

export default Router;
