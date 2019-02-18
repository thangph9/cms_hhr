const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const driver = require('cassandra-driver');

const models = require('../settings');

// const jwtprivate = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');

const router = express.Router();

const Uuid = driver.types.Uuid; // eslint-disable-line

function fetch(req, res) {
  const members = [];
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.users.find({}, (err, items) => {
          if (items && items.length > 0) {
            items.map((e, i) => {
              const item = {
                fullname: e.fullname,
                age: new Date().getYear() - e.createat.getYear(),
                address: e.address,
                createat: e.createat,
                percent: 10,
                status: ['active', 'exception', 'normal'],
                owner: 'Active',
                href: '/member/center/'.concat(e.user_id),
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
  let users = {};
  const PARAM_IS_VALID = {};
  const params = req.params; // eslint-disable-line
  async.series(
    [
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.user_id = models.uuidFromString(params.user_id); // eslint-disable-line
        } catch (e) {
          res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      function getDataUser(callback) {
        models.instance.users.find({ user_id: PARAM_IS_VALID.user_id }, (err, items) => {
          users = items;
          callback(err, null);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function add(req, res) {
  const users = {};
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initialParam(callback) {
        try {
          PARAM_IS_VALID.user_id = Uuid.random();
          PARAM_IS_VALID.fullname = params.fullname;
          PARAM_IS_VALID.gender = params.gender;
          PARAM_IS_VALID.dob_day = params.dob_day;
          PARAM_IS_VALID.dob_month = params.dob_month;
          PARAM_IS_VALID.dob_year = params.dob_year;
          PARAM_IS_VALID.dob_year = params.dob_year;
          PARAM_IS_VALID.phone = params.phone;
          PARAM_IS_VALID.address = params.address;
          PARAM_IS_VALID.hhr_goal = params.hhr_goal;
        } catch (e) {
          res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      function addToUsers(callback) {
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
    }
  );
}
function update(req, res) {
  const users = {};
  async.series(
    [
      function initialParam(callback) {
        callback(null, null);
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      res.send({ status: 'ok', data: users });
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
          PARAM_IS_VALID.user_id = models.uuidFromString(params.userid); // eslint-disable-line
        } catch (e) {
          res.send({ status: 'invalid' });
        }
        callback(null, null);
      },
      function deleteUser(callback) {
        try {
          models.instance.users.delete({ user_id: PARAM_IS_VALID.user_id }, err => {
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
function currentUser(req, res) {
  /*
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit  = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    let users={};
    let PARAM_IS_VALID={};
    async.series([
        function initialParam(callback){
            PARAM_IS_VALID.user_id=models.uuidFromString(legit.user_id);
            callback(null,null);
        },
        function getDataUser(callback){
          try{
            models.instance.users.find({user_id:PARAM_IS_VALID.user_id},(err,items)=>{
              users=items;
              callback(err,null)
            })  
          }catch(e){
             return res.send({status:'error'});
          }    
        }
    ],(err)=>{
       if(err) res.send({status: 'error'});
       res.send({status: 'ok',data: users})
    });
    */
  return res.send({
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  });
}
router.get('/', currentUser);
router.get('/fetch', fetch);
router.get('/fetch/by/:id', fetchBy);
router.post('/add', add);
router.put('/update', update);
router.put('/delete/:userid', deleted);
module.exports = router;
