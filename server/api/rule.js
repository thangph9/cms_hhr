const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function add(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.description = params.description;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addRule(callback) {
        const ruleObject = {
          name: PARAM_IS_VALID.name,
          description: PARAM_IS_VALID.description,
        };
        const instance = new models.instance.rule(ruleObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function get(req, res) {
  async.series(
    [
      function getRule(callback) {
        models.instance.rule.find({}, (err, item) => {
          callback(err, item);
        });
      },
    ],
    (err, result) => {
      const dataSource = {
        list: result[0],
      };
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', ...dataSource });
    }
  );
}
function put(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.description = params.description || null;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addRule(callback) {
        const ruleObject = {
          name: PARAM_IS_VALID.name,
        };
        const queryObject = { description: PARAM_IS_VALID.description };
        const options = { if_exists: true };
        models.instance.rule.update(ruleObject, queryObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      console.log(err);
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function remove(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.query;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.name = params.name;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function removeRule(callback) {
        const queryObject = {
          name: PARAM_IS_VALID.name,
        };
        models.instance.rule.delete(queryObject, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: params });
    }
  );
}
router.post('/', add);
router.get('/', get);
router.put('/', put);
router.delete('/', remove);
module.exports = router;
