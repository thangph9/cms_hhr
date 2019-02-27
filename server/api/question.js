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
          PARAM_IS_VALID.question_id = Uuid.random();
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.type = params.options;
          PARAM_IS_VALID.answer = params.answer || [];
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addQuestion(callback) {
        const questionObject = {
          question_id: PARAM_IS_VALID.question_id,
          title: PARAM_IS_VALID.title,
          type: PARAM_IS_VALID.type,
          answer: PARAM_IS_VALID.answer,
        };
        const instance = new models.instance.question(questionObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
router.post('/form/add', add);
module.exports = router;
