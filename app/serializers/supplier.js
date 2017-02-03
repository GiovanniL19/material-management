export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    stock: {
      serialize: 'ids',
      deserialize: 'ids'
    },
    transactionHistory: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
