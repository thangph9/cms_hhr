/* eslint consistent-return: 0 */

/* eslint array-callback-return: 0 */

const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const models = require('../settings');

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const router = express.Router();

const Uuid = models.datatypes.Uuid; // eslint-disable-line

function fetch(req, res) {
  const members = [];
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.track.find({}, (err, items) => {
          if (items && items.length > 0) {
            items.map((e, i) => {
              const item = {
                title: e.title,
                date: e.date,
                description: e.description,
                createat: e.createat,
                track_id: e.track_id,
                status: e.status,
                audio: e.audio,
                mc: e.mc,
                icon: e.icon,
                youtube: e.youtube,
                local: e.local,
              };
              members[i] = item;
              return true;
            });
          }
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: members });
    }
  );
}
function fetchBy(req, res) {
  let track = {};
  let trackData = [];
  const PARAM_IS_VALID = {};
  const params = req.params; // eslint-disable-line
  async.series(
    [
      // eslint-disable-next-line
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.track_id = models.uuidFromString(params.track_id); // eslint-disable-line
        } catch (e) {
          res.send({ status: 'invalid' });
        } finally {
          callback(null, null);
        }
      },
      function getDataTrack(callback) {
        models.instance.track.find({ track_id: PARAM_IS_VALID.track_id }, (err, items) => {
          trackData = items;
          callback(err, null);
        });
      },
      function extraData(callback) {
        if (trackData && trackData.length > 0) {
          trackData.map(e => {
            const item = {
              title: e.title,
              date: e.date,
              description: e.description,
              createat: e.createat,
              track_id: e.track_id,
              status: e.status,
              audio: e.audio,
              mc: e.mc,
              icon: e.icon,
              local: e.local,
              youtube: e.youtube,
            };
            track = item;
          });
        }
        callback(null, null);
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });
      res.send({ status: 'ok', data: track });
    }
  );
}
function add(req, res) {
  let track = {};
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      // eslint-disable-next-line
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.track_id = Uuid.random();
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.local = params.local;
          PARAM_IS_VALID.audio = models.uuidFromString(params.fileID);
          PARAM_IS_VALID.mc = params.mc;
          PARAM_IS_VALID.date = params.date;
          PARAM_IS_VALID.description = params.description;
          PARAM_IS_VALID.status = params.public;
          PARAM_IS_VALID.youtube = params.youtube;
          PARAM_IS_VALID.createat = new Date();
        } catch (e) {
          return res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      // eslint-disable-next-line
      function addToTrack(callback) {
        const trackObject = {
          track_id: PARAM_IS_VALID.track_id,
          title: PARAM_IS_VALID.title,
          local: PARAM_IS_VALID.local,
          audio: PARAM_IS_VALID.audio,
          mc: PARAM_IS_VALID.mc,
          date: PARAM_IS_VALID.date,
          description: PARAM_IS_VALID.description,
          status: PARAM_IS_VALID.status,
          youtube: PARAM_IS_VALID.youtube,
          createat: PARAM_IS_VALID.createat,
        };
        track = trackObject;
        const instance = new models.instance.track(trackObject); // eslint-disable-line

        instance.save(err => {
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });
      return res.send({ status: 'ok', data: track });
    }
  );
}
function update(req, res) {
  let track = {};
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      // eslint-disable-next-line
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.track_id = models.uuidFromString(params.track_id);
          PARAM_IS_VALID.title = params.title;
          PARAM_IS_VALID.local = params.local;
          PARAM_IS_VALID.audio = models.uuidFromString(params.fileID);
          PARAM_IS_VALID.mc = params.mc;
          PARAM_IS_VALID.date = params.date;
          PARAM_IS_VALID.description = params.description;
          PARAM_IS_VALID.status = params.public;
          PARAM_IS_VALID.youtube = params.youtube;
        } catch (e) {
          return res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      // eslint-disable-next-line
      function addToTrack(callback) {
        const trackObject = {
          title: PARAM_IS_VALID.title,
          local: PARAM_IS_VALID.local,
          audio: PARAM_IS_VALID.audio,
          mc: PARAM_IS_VALID.mc,
          date: PARAM_IS_VALID.date,
          description: PARAM_IS_VALID.description,
          status: PARAM_IS_VALID.status,
          youtube: PARAM_IS_VALID.youtube,
        };
        track = trackObject;
        const query_object = { track_id: PARAM_IS_VALID.track_id }; // eslint-disable-line
        const options = { if_exists: true };
        models.instance.track.update(query_object, trackObject, options, err => {
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: track });
    }
  );
}
function deleted(req, res) {
  const params = req.params; // eslint-disable-line
  const PARAM_IS_VALID = {};
  async.series(
    [
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.track_id = models.uuidFromString(params.track_id); // eslint-disable-line
        } catch (e) {
          res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      function deleteUser(callback) {
        try {
          models.instance.track.delete({ track_id: PARAM_IS_VALID.track_id }, err => {
            callback(err, null);
          });
        } catch (e) {
          res.send({ status: 'error' });
        }
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok' });
    }
  );
}
router.get('/list', fetch);
router.get('/get/:track_id', fetchBy);
router.post('/form/add', add);
router.put('/form/update', update);
router.delete('/delete/:userid', deleted);
module.exports = router;
