import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    bikes: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
