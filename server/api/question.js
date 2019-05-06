const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function save(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          if (params.action === 'add') {
            PARAM_IS_VALID.question_id = Uuid.random();
          } else {
            PARAM_IS_VALID.question_id = models.uuidFromString(params.question_id);
          }
          PARAM_IS_VALID.group_id = models.uuidFromString(params.group_id);
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.type = params.options;
          PARAM_IS_VALID.answer = params.listAnswer || [];
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function updateQuestion(callback) {
        console.log(PARAM_IS_VALID);
        const object = {
          title: PARAM_IS_VALID.title,
          group_id: PARAM_IS_VALID.group_id,
          type: PARAM_IS_VALID.type,
          answer: PARAM_IS_VALID.answer,
        };
        if (params.action === 'add') {
          object.question_id = PARAM_IS_VALID.question_id;
          const instance = new models.instance.question(object); // eslint-disable-line
          instance.save(err => {
            callback(err);
          });
        } else {
          const queryObject = { question_id: PARAM_IS_VALID.question_id };
          const options = { if_exists: true };
          models.instance.question.update(queryObject, object, options, err => {
            callback(err);
          });
        }
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.send({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function fetch(req, res) {
  async.series(
    [
      function fetchGroup(callback) {
        const { group } = models.instance;
        group.find({}, (err, items) => {
          const itm = items || [];
          callback(err, itm);
        });
      },
      function fetchQuestion(callback) {
        const { question } = models.instance;
        question.find({}, (err, items) => {
          callback(err, items);
        });
      },
    ],
    (err, results) => {
      const list = [];
      if (Array.isArray(results[1])) {
        const rs = results[1];
        rs.forEach((e, i) => {
          const ne = JSON.parse(JSON.stringify(e));
          const l = results[0].filter(k => k.group_id.equals(e.group_id));
          ne.group = l[0] ? l[0].title : null;
          list[i] = ne;
        });
      }
      const data = {
        list,
        pagination: {},
      };
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data });
    }
  );
}
function remove(req, res) {
  const PARAM_IS_VALID = {};
  const { params } = req;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.question_id = models.uuidFromString(params.question_id);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function delQuestion(callback) {
        const queryObject = { question_id: PARAM_IS_VALID.question_id };
        models.instance.question.delete(queryObject, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok' });
    }
  );
}

router.post('/form/save', save);
router.get('/fetch', fetch);
router.delete('/remove/:group_id', remove);
module.exports = router;
