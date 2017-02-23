import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    group: {
      serialize: 'ids',
      deserialize: 'ids'
    },
    supplier: {
      serialize: 'ids',
      deserialize: 'ids'
    },
    bikes: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
