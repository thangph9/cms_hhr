module.exports = {
  fields: {
    user_id: 'uuid',
    address: 'text',
    audio: {
      type: 'map',
      typeDef: '<text,uuid>',
    },
    avatar: 'uuid',
    country: 'text',
    createat: 'timestamp',
    description: 'text',
    distance: 'float',
    dob_day: 'int',
    dob_month: 'int',
    dob_year: 'int',
    education: {
      type: 'map',
      typeDef: '<text,text>',
    },
    email: 'text',
    fullname: 'text',
    gender: 'text',
    height: 'text',
    hhr_goal: 'text',
    jobs: {
      type: 'map',
      typeDef: '<text,text>',
    },
    phone: 'text',
    phones: {
      type: 'map',
      typeDef: '<text,text>',
    },
    uniqueid: 'int',
    video: {
      type: 'map',
      typeDef: '<text,uuid>',
    },
    weight: 'text',
  },
  key: ['user_id'],
};
