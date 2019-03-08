module.exports = {
  fields: {
    question_id: 'uuid',
    type: 'text',
    title: 'text',
    answer: {
      type: 'set',
      typeDef: '<text>',
    },
    group_id: 'uuid',
  },
  key: ['question_id'],
};
