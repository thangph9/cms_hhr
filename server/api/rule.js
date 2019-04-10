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
          PARAM_IS_VALID.group_id = Uuid.random();
          PARAM_IS_VALID.title = params.title;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addGroup(callback) {
        const groupObject = {
          group_id: PARAM_IS_VALID.group_id,
          title: PARAM_IS_VALID.title,
        };
        const instance = new models.instance.group(groupObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      return res.json({ status: 'ok', data: PARAM_IS_VALID });
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

router.post('/', add);
router.get('/', get);
module.exports = router;
