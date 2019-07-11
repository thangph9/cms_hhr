module.exports = {
  fields: {
    menu_id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    item_id: 'uuid',
    orderby: { type: 'int', default: 1 },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: ['menu_id', 'item_id'],
  materialized_views: {
    view_menu_group1: {
      select: ['menu_id', 'item_id', 'orderby'],
      key: ['menu_id', 'item_id'],
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
