import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    transactions: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
