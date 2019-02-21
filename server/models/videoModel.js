module.exports = {
  fields: {
    videoid: 'uuid',
    video: 'blob',
    description: {
      type: 'map',
      typeDef: '<text,text>',
    },
    createat: 'timestamp',
  },
  key: ['videoid'],
};
