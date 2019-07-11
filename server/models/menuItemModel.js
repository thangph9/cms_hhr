module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    name: { type: 'varchar', default: 'no name provided' },
    icon: { type: 'varchar', default: 'no name provided' },
    path: { type: 'varchar', default: 'no name provided' },
    authority: {
      type: 'set',
      typeDef: '<text>',
    },
    active_icon: { type: 'varchar', default: 'no name provided' },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['id'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_menu_item1: {
      select: ['id', 'name', 'icon', 'path', 'authority', 'active_icon'],
      key: ['id', 'created'],
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
