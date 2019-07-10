module.exports = {
  fields: {
    phone: 'text', // unicode
    user_id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    password: 'text',
    password_hash_algorithm: 'text',
    password_salt: 'text',
    status: 'text',
    rule: {
      type: 'set',
      typeDef: '<text>',
    },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['phone'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_login: {
      select: ['phone', 'user_id', 'password', 'status', 'rule'],
      key: ['phone', 'created'],
    },
  },
  options: {
    timestamps: {
      createdAt: 'created_at', // defaults to createdAt
      updatedAt: 'updated_at', // defaults to updatedAt
    },
    versions: {
      key: '__v', // defaults to __v
    },
  },
};
