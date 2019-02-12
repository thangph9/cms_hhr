const models = require('express-cassandra');
const path = require('path');

const fullpath = path.join(__dirname, './models');
models.setDirectory(fullpath).bind(
  {
    clientOptions: {
      contactPoints: ['localhost'],
      protocalOptions: { port: 9042 },
      keyspace: 'hhr',
      queryOptions: { consistency: models.consistencies.one },
    },
    ormOptions: {
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1,
      },
      migration: 'safe',
    },
  },
  err => {
    if (err) throw err;
  }
);
module.exports = models;
