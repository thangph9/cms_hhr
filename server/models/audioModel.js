module.exports = {
  fields: {
    audioid: 'uuid',
    audio: 'blob',
    description: {
      type: 'map',
      typeDef: '<text,text>',
    },
    createat: 'timestamp',
  },
  key: ['audioid'],
};
