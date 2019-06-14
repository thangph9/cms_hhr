module.exports = {
  fields: {
    user_id: 'uuid',
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
    createat: 'timestamp',
  },
  key: ['user_id'],
};
