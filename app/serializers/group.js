import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    items: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
