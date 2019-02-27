module.exports = {
  fields: {
    question_id: 'uuid',
    type: 'text',
    title: 'text',
    answer: {
      type: 'set',
      typeDef: '<text>',
    },
  },
  key: ['question_id'],
};
