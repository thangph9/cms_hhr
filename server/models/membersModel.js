module.exports = {
  fields: {
    membersid: 'uuid',
    ucode: 'int',
    gcode: 'int',
    name: 'text',
    day: 'int',
    month: 'int',
    year: 'int',
    audio: 'uuid',
    location: 'text',
    description: {
      type: 'map',
      typeDef: '<text,text>',
    },
    address: 'text',
    mobile: 'text',
    gender: 'text',
    createat: 'timestamp',
    createby: 'text',
  },
  key: ['membersid'],
};
