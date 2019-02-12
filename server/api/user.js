const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const models = require('../settings');

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const router = express.Router();

function fetch(req, res) {
  let users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.users.find({}, (err, items) => {
          users = items;
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function fetchBy(req, res) {
  let users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.users.find({}, (err, items) => {
          users = items;
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function add(req, res) {
  const users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function update(req, res) {
  const users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function deleted(req, res) {
  const users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
router.get('/fetch', fetch);
router.get('/fetch/by/:id', fetchBy);
router.post('/add', add);
router.put('/update', update);
router.put('/delete/:userid', deleted);
module.exports = router;
