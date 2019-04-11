const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function add(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  const autoid = models.uuidFromString('8dfa9178-a614-4248-aba5-2dfe45b66344');
  let autoidTotal = 0;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.membersid = Uuid.random();
          PARAM_IS_VALID.ucode = params.ucode ? Number(params.ucode) : 0;
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.day = params.day ? Number(params.day) : 1;
          PARAM_IS_VALID.month = params.month ? Number(params.month) : 1;
          PARAM_IS_VALID.year = params.year ? Number(params.year) : 1970;
          PARAM_IS_VALID.audio = params.audio;
          PARAM_IS_VALID.location = params.location;
          PARAM_IS_VALID.description = params.description;
          PARAM_IS_VALID.job = params.job;
          PARAM_IS_VALID.relationship = params.relationship;
          PARAM_IS_VALID.address = params.address;
          PARAM_IS_VALID.mobile = params.mobile;
          PARAM_IS_VALID.gender = params.gender;
          PARAM_IS_VALID.timeup = params.timeup;
          PARAM_IS_VALID.createat = new Date();
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function getGCode(callback) {
        models.instance.autoid.find({ autoid }, (err, item) => {
          if (item && item[0]) {
            autoidTotal = item.length;
            PARAM_IS_VALID.gcode = Number(item[0].membersgcode) + 1;
          } else {
            PARAM_IS_VALID.gcode = 10000;
          }
          callback(err, null);
        });
      },
      function addMembers(callback) {
        let audio = PARAM_IS_VALID.audio; // eslint-disable-line
        if (Array.isArray(PARAM_IS_VALID.audio)) {
          audio = models.uuidFromString(PARAM_IS_VALID.audio.file.response.file.audioid); // eslint-disable-line
        }
        const membersObject = { ...PARAM_IS_VALID, audio };
        const instance = new models.instance.members(membersObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
      function updateGcode(callback) {
        const queryObject = { autoid };
        const options = {};
        let updateValuesObject = { membersgcode: models.datatypes.Long.fromInt(1) };
        if (autoidTotal === 0) {
          updateValuesObject = { membersgcode: models.datatypes.Long.fromInt(10000) };
        }
        models.instance.autoid.update(queryObject, updateValuesObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      console.log(err);
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function update(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.membersid = models.uuidFromString(params.membersid);
          PARAM_IS_VALID.ucode = params.ucode ? Number(params.ucode) : 0;
          PARAM_IS_VALID.name = params.name ? params.name : null;
          PARAM_IS_VALID.day = params.day ? params.day : 0;
          PARAM_IS_VALID.month = params.month ? params.month : 0;
          PARAM_IS_VALID.year = params.year ? Number(params.year) : 0;
          PARAM_IS_VALID.audio = params.audio ? params.audio : null;
          PARAM_IS_VALID.location = params.location ? params.location : null;
          PARAM_IS_VALID.description = params.description ? params.description : {};
          PARAM_IS_VALID.job = params.job ? params.job : null;
          PARAM_IS_VALID.relationship = params.relationship ? params.relationship : null;
          PARAM_IS_VALID.address = params.address ? params.address : null;
          PARAM_IS_VALID.mobile = params.mobile ? params.mobile : null;
          PARAM_IS_VALID.gender = params.gender ? params.gender : null;
          PARAM_IS_VALID.timeup = params.timeup ? params.timeup : null;
          PARAM_IS_VALID.gcode = params.gcode ? params.gcode : 0;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addMembers(callback) {
        let audio = PARAM_IS_VALID.audio; // eslint-disable-line
        console.log(params);
        if (PARAM_IS_VALID.audio.file) {
          // eslint-disable-line
          audio = models.uuidFromString(PARAM_IS_VALID.audio.file.response.file.audioid); // eslint-disable-line
        }
        const queryObject = { membersid: PARAM_IS_VALID.membersid };
        const updateValuesObject = {
          ucode: PARAM_IS_VALID.ucode,
          name: PARAM_IS_VALID.name,
          year: PARAM_IS_VALID.year,
          day: PARAM_IS_VALID.day,
          month: PARAM_IS_VALID.month,
          audio,
          location: PARAM_IS_VALID.location,
          description: PARAM_IS_VALID.description,
          job: PARAM_IS_VALID.job,
          relationship: PARAM_IS_VALID.relationship,
          address: PARAM_IS_VALID.address,
          mobile: PARAM_IS_VALID.mobile,
          gender: PARAM_IS_VALID.gender,
          timeup: PARAM_IS_VALID.timeup,
        };
        const options = { if_exists: true };
        models.instance.members.update(queryObject, updateValuesObject, options, err => {
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
function fetchBy(req, res) {
  const PARAM_IS_VALID = {};
  const { params } = req;
  let result = {};
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.membersid = models.uuidFromString(params.membersid);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addGroup(callback) {
        models.instance.members.find({ membersid: PARAM_IS_VALID.membersid }, (err, items) => {
          result = items && items.length > 0 ? items[0] : {};
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      return res.json({ status: 'ok', data: result });
    }
  );
}
function fetch(req, res) {
  let result = [];
  async.series(
    [
      function getMembers(callback) {
        models.instance.members.find({}, (err, items) => {
          result = items;
          callback(err, null);
        });
      },
    ],
    err => {
      const pagination = {};
      if (err) res.send({ status: 'error' });
      return res.json({ status: 'ok', data: { list: result, pagination } });
    }
  );
}
function search(req, res) {
  let result = [];
  async.series(
    [
      function getMembers(callback) {
        models.instance.members.find({}, (err, items) => {
          result = items;
          callback(err, null);
        });
      },
    ],
    err => {
      const pagination = {};
      if (err) res.send({ status: 'error' });
      return res.json({ status: 'ok', data: { list: result, pagination } });
    }
  );
}
function del(req, res) {
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

router.post('/form/add', add);
router.put('/form/update', update);
router.get('/fetch', fetch);
router.get('/fetch/:membersid', fetchBy);
router.get('/search', search);
router.delete('/del/:membersid', del);
module.exports = router;
