const crypto = require('crypto');

module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },

    username: { type: 'varchar', default: 'no name provided' },
    name: { type: 'varchar', default: 'no name provided' },
    surname: { type: 'varchar', default: 'no surname provided' },
    complete_name: {
      type: 'varchar',
      virtual: {
        get: () => this.name.concat(' ', this.surname),
        set: value => {
          const result = value.split(' ');
          this.name = result[0]; // eslint-disable-line
          this.surname = result[1]; // eslint-disable-line
        },
      },
    },
    password_hash: 'blob',
    active: 'boolean',
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['id'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_account1: {
      select: ['name', 'active'],
      key: [['name', 'id'], 'created'],
      clustering_order: { created: 'desc' },
      filters: {
        created: { $gte: new Date('2019-01-01') },
        age: { $isnt: null },
      },
    },
  },
  indexes: ['name'],
  methods: {
    setPassword: (password, callback) => {
      const config = {
        // size of the generated hash
        hashBytes: 32,
        // larger salt means hashed passwords are more resistant to rainbow table, but
        // you get diminishing returns pretty fast
        saltBytes: 16,
        // more iterations means an attacker has to take longer to brute force an
        // individual password, so larger is better. however, larger also means longer
        // to hash the password. tune so that hashing the password takes about a
        // second
        iterations: 872791,
      };
      crypto.randomBytes(config.saltBytes, (err, salt) => {
        if (err) callback(err);

        crypto.pbkdf2Sync(password, salt, config.iterations, config.hashBytes, (err2, hash) => {
          if (err2) return callback(err2);

          const combined = Buffer.alloc(hash.length + salt.length + 8);

          // include the size of the salt so that we can, during verification,
          // figure out how much of the hash is salt
          combined.writeUInt32BE(salt.length, 0, true);
          // similarly, include the iteration count
          combined.writeUInt32BE(config.iterations, 4, true);
          salt.copy(combined, 8);
          hash.copy(combined, salt.length + 8);
          this.password_hash = combined;
          return callback(null, combined);
        });
      });
    },
  },
  options: {
    timestamps: {
      createdAt: 'created_at', // defaults to createdAt
      updatedAt: 'updated_at', // defaults to updatedAt
    },
    versions: {
      key: '__v', // defaults to __v
    },
  },
};
