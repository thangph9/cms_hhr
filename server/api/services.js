const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();
/*
  service_manager_id: '14',
  command_code: 'HHR',
  user_id: '84963760289',
  service_id: '8779',
  message: 'HHR Thang Nam',
  request_id: '4931246570' 
*/

function service(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.id = Uuid.random();
          PARAM_IS_VALID.command_code = params.command_code;
          PARAM_IS_VALID.user_id = params.user_id;
          PARAM_IS_VALID.service_id = params.service_id;
          PARAM_IS_VALID.message = params.message;
          PARAM_IS_VALID.request_id = params.request_id;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function saveServiceRegister(callback) {
        const serviceRegister = {
          id: PARAM_IS_VALID.id,
          command_code: PARAM_IS_VALID.command_code,
          user_id: PARAM_IS_VALID.user_id,
          service_id: PARAM_IS_VALID.service_id,
          message: PARAM_IS_VALID.message,
          request_id: PARAM_IS_VALID.request_id,
        };
        const instance = new models.instance.serviceRegister(serviceRegister); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      console.log(err);
      const data = {
        status: '0',
        request_id: PARAM_IS_VALID.request_id,
        sms: [
          {
            message: 'Hello Test Service',
            message_type: '1',
            total_message: '1',
            message_index: '1',
            content_type: '0',
            is_more: '0',
          },
        ],
      };
      if (err) res.send({ ...data });
      else res.json({ ...data });
    }
  );
}

function otp(req, res) {
  const params = req.body;
  console.log(params);
  const data = {
    status: '0',
    request_id: '10000',
    sms: [
      {
        message: 'Hello Test Service',
        message_type: '1',
        total_message: '1',
        message_index: '1',
        content_type: '0',
        is_more: '0',
      },
    ],
  };
  res.json({ ...data });
}

// router.get('/register', save);
router.post('/register', service);
router.post('/otp', otp);

module.exports = router;
