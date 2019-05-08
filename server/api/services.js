const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function save(req, res) {
  console.log(req.headers);
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
  console.log(data);
  res.json({ ...data });
}
router.get('/register', save);
router.post('/register', save);
module.exports = router;
