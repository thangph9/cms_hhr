module.exports = {
  fields: {
    user_id: 'uuid',
    question_id: 'uuid',
    answer: {
      type: 'set',
      typeDef: '<text>',
    },
  },
  key: ['user_id', 'question_id'],
};
