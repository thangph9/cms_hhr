const sharp = require('sharp'); // eslint-disable-line
const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const router = express.Router();

function resize(image, w, h, callback) {
  sharp(image)
    .resize(w, h)
    .toBuffer()
    .then(data => {
      callback(null, data);
    })
    .catch(err => callback(err, null));
}

function getImage(req, res) {
  let image = null;
  const PARAM_IS_VALID = {};
  const tasks = [
    function validParams(callback) {
      try {
        const rawImage = req.params.imageid.substring(0, 32);
        const uuid = rawImage
          .substring(0, 7)
          .concat(
            '-',
            rawImage.substring(7, 11),
            '-',
            rawImage.substring(11, 15),
            '-',
            rawImage.substring(20, 32)
          );
        PARAM_IS_VALID.imageid = models.uuidFromString(uuid);
      } catch (e) {
        res.contentType('image/jpeg');
        return res.end('', 'binary');
      }
      return callback(null);
    },
    function fetchImage(callback) {
      models.instance.images.find({ imageid: PARAM_IS_VALID.imageid }, (err, img) => {
        if (img !== undefined && img.length > 0) {
          image = img[0].image; //  eslint-disable-line
        }
        callback(err, null);
      });
    },
  ];
  async.series(tasks, err => {
    if (err) {
      res.contentType('image/jpeg');
      res.end('', 'binary');
    } else if (image != null) {
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(image, 'binary');
    } else {
      res.contentType('image/jpeg');
      res.end('', 'binary');
    }
  });
}
function image90w(req, res) {
  let image = null;
  let imageid = '';
  let resizedata = '';
  const tasks = [
    function validParams(callback) {
      try {
        const rawImage = req.params.imageid.substring(0, 32);
        const uuid = rawImage
          .substring(0, 7)
          .concat(
            '-',
            rawImage.substring(7, 11),
            '-',
            rawImage.substring(11, 15),
            '-',
            rawImage.substring(20, 32)
          );
        imageid = models.uuidFromString(uuid);

        imageid = models.uuidFromString(uuid);
      } catch (e) {
        res.contentType('image/jpeg');
        res.end('', 'binary');
      }
      return callback(null);
    },
    function fetchImage(callback) {
      models.instance.images.find({ imageid }, (err, img) => {
        if (img && img.length > 0) {
          image = img[0].image; // eslint-disable-line
        }
        callback(err, null);
      });
    },
    function(callback) {
      if (image) {
        resize(image, 80, 100, (err, img) => {
          resizedata = img;
          callback(err, null);
        });
      }
      callback(null);
    },
  ];
  async.series(tasks, err => {
    if (err) {
      res.contentType('image/jpeg');
      res.end('', 'binary');
    } else if (image != null) {
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(resizedata, 'binary');
    } else {
      res.contentType('image/jpeg');
      res.end('', 'binary');
    }
  });
}

router.get('/images/f/:imageid', getImage);
router.get('/images/w90/:imageid', image90w);
module.exports = router;
