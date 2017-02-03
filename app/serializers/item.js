export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    group: {
      serialize: 'ids',
      deserialize: 'ids'
    },
    supplier: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
