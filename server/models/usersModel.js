module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    address: 'text',
    avatar: 'uuid',
    country: 'text',
    description: 'text',
    distance: 'float',
    dob_day: 'int',
    dob_month: 'int',
    public: 'text',
    dob_year: 'int',
    email: 'text',
    fullname: 'text',
    gender: 'varchar',
    height: 'text',
    weight: 'text',
    hhr_goal: 'text',
    phone: 'text',
    uniqueid: 'int',
    hometown: 'text',
    location: 'text',
    marriage: 'text',
    vov: { type: 'boolean', default: true },
    active_friend: { type: 'boolean', default: true },
    hobbys: {
      type: 'map',
      typeDef: '<text,text>',
    },
    assets: {
      type: 'map',
      typeDef: '<text,text>',
    },
    video: {
      type: 'map',
      typeDef: '<text,uuid>',
    },
    jobs: {
      type: 'map',
      typeDef: '<text,text>',
    },
    education: {
      type: 'map',
      typeDef: '<text,text>',
    },
    audio: {
      type: 'map',
      typeDef: '<text,uuid>',
    },
    phones: {
      type: 'map',
      typeDef: '<text,text>',
    },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['id'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_user: {
      select: ['*'],
      key: ['id', 'created'],
    },
    view_user_phone: {
      select: ['phone', 'id'],
      key: ['phone', 'id', 'created'],
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
