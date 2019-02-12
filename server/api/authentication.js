const async = require('async'); // eslint-disable-line
const fs = require('fs');
const express = require('express'); // eslint-disable-line
const driver = require('cassandra-driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
/* eslint-disable prefer-destructuring */
const Uuid = driver.types.Uuid;
const router = express.Router();
// const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
const models = require('../settings');

const MESSAGE = {
  USER_NOT_MATCH: 'Tài khoản hoặc mật khẩu không đúng',
  USER_NOT_FOUND: 'Tài khoản này không tồn tại!',
  USER_HAD_BANNED: 'Tài khoản đang bị khoá',
  SYSTEM_BUSY: 'Hệ thống bận!',
  PAYMENT_NOT_SEND_OTP: 'Bạn chưa nhắn tin xác thực! Hãy nhắn tin tới tổng đài.',
  PAYMENT_OTP_OK: 'Xác thực thành công!',
  PAYMENT_OTP_WRONG: 'OTP không chính xác.',
  USER_EXISTS: 'Tài khoản đã được sử dụng',
  CONFIRM_TOKEN: 'Vui lòng kiểm tra Email của bạn để xác thực tài khoản',
};

function register(req, res) {
  const params = req.body;
  const userId = Uuid.random();
  const saltRounds = 10;
  const queries = [];
  const msg = '';
  const PARAM_IS_VALID = {};
  let verificationUrl = '';
  let salt = '';
  let hash = '';
  const tasks = [
    function validParams(callback) {
      PARAM_IS_VALID.phone = params.phone;
      PARAM_IS_VALID.email = params.email;
      PARAM_IS_VALID.otp = params.otp;
      PARAM_IS_VALID.fullname = params.fullname;
      PARAM_IS_VALID.username = params.email;
      PARAM_IS_VALID.address = params.address;
      PARAM_IS_VALID.password = params.password;
      PARAM_IS_VALID.user_id = userId;
      PARAM_IS_VALID.enabled = true;
      PARAM_IS_VALID.createat = new Date().getTime();
      callback(null, null);
    },
    function genSaltToken(callback) {
      bcrypt.genSalt(saltRounds, (err, rs) => {
        salt = rs;
        callback(err, null);
      });
    },
    function getHashToken(callback) {
      bcrypt.hash(params.password, salt, (err, rs) => {
        hash = rs;
        callback(err, null);
      });
    },
    function fetchPassword(callback) {
      models.instance.login.find({ phone: PARAM_IS_VALID.phone }, (err, _user) => {
        if (_user !== undefined && _user.length > 0) {
          res.json({
            status: 'error',
            message: 'Tài khoản đã tồn tại!',
          });
        }
        callback(err, null);
      });
    },
    function checkCaptcha(callback) {
      if (!params.captcha) {
        return res.json({ responseCode: 1, responseDesc: 'Please select captcha' });
      }
      verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6Ld1534UAAAAAFF8A3KCBEAfcfjS6COX9obBJrWV&response='.concat(
        params.captcha,
        '&remoteip=',
        req.connection.remoteAddress
      );
      return callback(null, verificationUrl);
    },
    function verifyCaptcha(callback) {
      request(verificationUrl, (error, response, b) => {
        const body = JSON.parse(b);
        if (body.success === false) {
          res.json({
            status: 'error',
            message: 'Sai captcha',
          });
        }
        callback(error, null);
      });
    },
    function saveUser(callback) {
      const userObject = {
        user_id: PARAM_IS_VALID.user_id,
        address: PARAM_IS_VALID.address,
        email: PARAM_IS_VALID.email,
        createat: PARAM_IS_VALID.createat,
        name: PARAM_IS_VALID.fullname,
        phone: PARAM_IS_VALID.phone,
      };
      const loginObject = {
        phone: PARAM_IS_VALID.phone,
        enabled: PARAM_IS_VALID.enabled,
        password: hash,
        password_hash_algorithm: 'bcrypt',
        password_salt: salt,
        user_id: PARAM_IS_VALID.user_id,
      };
      /* eslint-disable new-cap */

      if (msg.length === 0) {
        const Users = () => {
          const object = userObject;
          const instance = new models.instance.users(object);
          const save = instance.save({ if_exist: true, return_query: true });
          return save;
        };
        queries.push(Users());
        const Login = () => {
          const object = loginObject;
          const instance = new models.instance.login(object);
          const save = instance.save({ if_exist: true, return_query: true });
          return save;
        };
        queries.push(Login());
      }
      callback(null, null);
    },
    function doSubmit(callback) {
      models.doBatch(queries, err => {
        callback(err, null);
      });
    },
  ];
  async.series(tasks, err => {
    if (err) return res.json({ status: 'error' });
    return res.json({
      status: 'ok',
      message: 'Đăng ký thành công!',
    });
  });
}
function login(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  let user = {};
  let msg = '';
  let verificationUrl = '';
  let hashPassword = '';
  let isLogin = false;
  let token = '';
  const tasks = [
    function validParams(callback) {
      PARAM_IS_VALID.phone = params.username;
      PARAM_IS_VALID.password = params.password;
      PARAM_IS_VALID.captcha = params.captcha;
      callback(null, null);
    },
    function fetchPassword(callback) {
      models.instance.login.find({ phone: PARAM_IS_VALID.phone }, (err, _user) => {
        if (Array.isArray(_user)) {
          if (_user[0].enabled) {
            hashPassword = _user[0].password;
          } else {
            msg = MESSAGE.USER_HAD_BANNED;
          }
          user = _user;
        } else {
          msg = MESSAGE.USER_NOT_FOUND;
        }
        callback(err, null);
      });
    },
    function validPassword(callback) {
      if (hashPassword !== '') {
        bcrypt.compare(PARAM_IS_VALID.password, hashPassword, (err, result) => {
          // res == true
          if (result) {
            isLogin = result;
          } else {
            msg = MESSAGE.USER_NOT_MATCH;
          }
          callback(err, null);
        });
      } else callback(null, null);
    },
    function Login(callback) {
      if (isLogin) {
        try {
          token = jwt.sign(
            {
              userid: user[0].user_id,
            },
            jwtprivate,
            {
              expiresIn: '30d', // expires in 30 day
              algorithm: 'RS256',
            }
          );
        } catch (e) {
          // console.log(e);
        }
      }
      callback(null, token);
    },
    function getCaptcha(callback) {
      if (!params.captcha) {
        return res.json({ responseCode: 1, responseDesc: 'Please select captcha' });
      }
      verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6Ld1534UAAAAAFF8A3KCBEAfcfjS6COX9obBJrWV&response='.concat(
        params.captcha,
        '&remoteip=',
        req.connection.remoteAddress
      );
      return callback(null, null);
    },
  ];
  async.series(tasks, err => {
    if (err) {
      res.json({ status: 'error', message: msg });
    } else {
      request(verificationUrl, (error, response, b) => {
        const body = JSON.parse(b);
        if (msg !== '' || body.success === false) {
          res.json({ status: 'error', message: msg, success: body.success });
        } else {
          res.json({
            status: 'ok',
            currentAuthority: { auth: isLogin, token: token }, // eslint-disable-line
            phone: user[0].phone,
            success: body.success,
          });
        }
      });
    }
  });
}
router.post('/register', register);
router.post('/login', login);
module.exports = router;
