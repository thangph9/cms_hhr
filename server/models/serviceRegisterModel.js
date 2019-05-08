module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    command_code: 'text',
    request_id: 'text',
    message: 'text',
    user_id: 'text',
    service_id: 'text',
    name: 'text',
    gender: 'text',
    action: 'text',
    description: 'text',
    year: {
      type: 'int',
      default: parseInt(new Date().getFullYear()), // eslint-disable-line
    },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['id'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_group2: {
      select: [
        'command_code',
        'request_id',
        'message',
        'user_id',
        'service_id',
        'id',
        'name',
        'gender',
        'action',
        'description',
        'created',
        'year',
      ],
      key: [['year', 'id'], 'created'],
      clustering_order: { created: 'desc' },
    },
  },
  indexes: ['command_code'],
  options: {
    timestamps: {
      createdAt: 'created_at', // defaults to createdAt
      updatedAt: 'updated_at', // defaults to updatedAt
    },
    versions: {
      key: '__v1', // defaults to __v
    },
  },
};
