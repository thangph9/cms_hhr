module.exports = {
  fields: {
    menuitemid: 'uuid',
    name: 'text',
    icon: 'text',
    path: 'text',
    authority: {
      type: 'set',
      typeDef: '<text>',
    },
    activeicon: 'text',
  },
  key: ['menuitemid'],
};
