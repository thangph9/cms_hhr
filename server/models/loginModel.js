module.exports = {
  fields: {
    phone: 'text', // unicode
    user_id: 'uuid', // 128bit
    rule: {
      type: 'set',
      typeDef: '<text>',
    },
    password: 'text',
    password_hash_algorithm: 'text',
    password_salt: 'text',
  },
  key: ['phone', 'user_id'],
};
