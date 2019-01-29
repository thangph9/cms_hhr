/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable import/no-extraneous-dependencies */
const async = require('async');
const fs = require('fs');
const express = require('express');
const driver = require('cassandra-driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request'); // eslint-disable-line
/* eslint-disable prefer-destructuring */
const Uuid = driver.types.Uuid;
const router = express.Router();
// const jwtpublic = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
// const models = require('../settings');

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
  var token = '';
  try {
    token = jwt.sign(
      {
        username: params.phone,
      },
      jwtprivate,
      {
        expiresIn: '30d', // expires in 30 day
        algorithm: 'RS256',
      }
    );
  } catch (e) {
    throw e;
  }
  return res.json({ status: 'ok', token });
}
function login(req, res) {
  const params = req.body;
  var result = false;
  var token = '';
  var arrDb = [
    {
      phone: '0123456789',
      password: '0123456789',
    },
    {
      phone: '9876543210',
      password: '9876543210',
    },
  ];
  for (var i = 0; i < arrDb.length; i++) {
    if (params.phone === arrDb[i].phone && params.password === arrDb[i].password) {
      result = true;
      try {
        token = jwt.sign(
          {
            username: params.phone,
          },
          jwtprivate,
          {
            expiresIn: '30d', // expires in 30 day
            algorithm: 'RS256',
          }
        );
      } catch (e) {
        throw e;
      }
    }
  }
  if (result === true) return res.json({ status: 'ok', token });
  return res.json({
    status: 'error',
    message: 'Tài khoản hoặc mật khẩu không đúng',
    timeline: new Date().getTime(),
  });
}
function homeDemo(req, res) {
  setTimeout(() => {
    res.json({ status: 'ok' });
  }, 3000);
}
export default {
  // 'POST /api/authentication/register': register,
  // 'POST /api/authentication/login': login,
  // 'GET /api/authentication/homedemo': homeDemo,
};
