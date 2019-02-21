const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const fs = require('fs');
// const path = require('path');
const multer = require('multer'); // eslint-disable-line

const models = require('../settings');

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const router = express.Router();

const Uuid = models.datatypes.Uuid; // eslint-disable-line

function audioUpload(req, res) {
  let status = '';
  const audioid = Uuid.random();
  const storage = multer.diskStorage({
    destination: (_, file, cb) => {
      cb(null, 'public/files');
    },
    filename: (_, file, cb) => {
      cb(null, audioid.toString().concat('.MP3'));
    },
  });
  const upload = multer({ storage: storage }); // eslint-disable-line

  upload.single('logo')(req, res, err => {
    if (err) {
      status = 'error';
      return false;
    }

    try {
      const file = req.file; // eslint-disable-line
      // const audio=file.buffer;
      const audio = fs.readFileSync(file.path); // eslint-disable-line
      const description = {
        filename: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
      };
      const audioObject = {
        audioid,
        audio,
        description,
        createat: new Date(),
      };
      const instance = new models.instance.audio(audioObject); // eslint-disable-line
      // eslint-disable-next-line
      instance.save(err => {
        if (err) {
          status = 'error';
          return false;
        }
      });
    } catch (e) {
      status = 'error';
      return false;
    }
    if (status !== '') {
      res.send({ status: 'error' });
    } else {
      res.send({ status: 'ok', file: { audioid } });
    }
    return true;
    // return res.send({ status: 'ok', file: { audioid } });
  });
}
function loadAudio(req, res) {
  const params = req.params; // eslint-disable-line
  const PARAM_IS_VALID = {};
  const data = {};
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.audioid = models.uuidFromString(params.audioid);
        } catch (e) {
          res.send({ status: 'error' });
        }
        callback(null, null);
      },
      function fetchAudio(callback) {
        models.instance.audio.find({ audioid: PARAM_IS_VALID.audioid }, (err, track) => {
          if (track && track.length > 0) {
            data.audio = track[0].audio;
          }
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });
      const stat = data.audio;
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });
      return res.end(stat);
    }
  );
}
function loadAudioLocal(req, res) {
  const params = req.params; // eslint-disable-line
  const PARAM_IS_VALID = {};
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.audioid = models.uuidFromString(params.audioid);
        } catch (e) {
          res.send({ status: 'error' });
        }
        callback(null, null);
      },
    ],
    err => {
      if (err) return res.send({ status: 'error' });
      const pathLocal = 'public/files/'.concat(PARAM_IS_VALID.audioid.toString().concat('.MP3'));
      const stat = fs.readFileSync(pathLocal);
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });
      return res.end(stat);
    }
  );
}
router.post('/upload/audio', audioUpload);
router.get('/upload/audio/:audioid', loadAudio);
router.get('/upload/audio/local/:audioid', loadAudioLocal);
module.exports = router;
