/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const moment = require('moment'); // eslint-disable-line
const bcrypt = require('bcryptjs');
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
        models.instance.autoid.find(
          {
            autoid,
          },
          (err, item) => {
            if (item && item[0]) {
              autoidTotal = item.length;
              PARAM_IS_VALID.gcode = Number(item[0].membersgcode) + 1;
            } else {
              PARAM_IS_VALID.gcode = 10000;
            }
            callback(err, null);
          }
        );
      },
      function addMembers(callback) {
        let audio = ''; // eslint-disable-line
        const membersObject = { ...PARAM_IS_VALID };
        if (!PARAM_IS_VALID.audio) {
          audio = null;
        } else if (PARAM_IS_VALID.audio.file) {
          // eslint-disable-line
          audio = models.uuidFromString(PARAM_IS_VALID.audio.file.response.file.audioid); // eslint-disable-line
        } else {
          audio = models.uuidFromString(PARAM_IS_VALID.audio);
        }

        membersObject.audio = audio;
        const instance = new models.instance.members(membersObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
      function updateGcode(callback) {
        const queryObject = {
          autoid,
        };
        const options = {};
        let updateValuesObject = {
          membersgcode: models.datatypes.Long.fromInt(1),
        };
        if (autoidTotal === 0) {
          updateValuesObject = {
            membersgcode: models.datatypes.Long.fromInt(10000),
          };
        }
        models.instance.autoid.update(queryObject, updateValuesObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      console.log(err);
      if (err)
        res.send({
          status: 'error',
        });
      res.send({
        status: 'ok',
        data: PARAM_IS_VALID,
      });
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
        let audio = ''; // eslint-disable-line
        if (PARAM_IS_VALID.audio && PARAM_IS_VALID.audio.file) {
          // eslint-disable-line
          audio = models.uuidFromString(PARAM_IS_VALID.audio.file.response.file.audioid); // eslint-disable-line
        } else {
          audio = models.uuidFromString(PARAM_IS_VALID.audio);
        }
        const queryObject = {
          membersid: PARAM_IS_VALID.membersid,
        };
        const updateValuesObject = {
          ucode: PARAM_IS_VALID.ucode,
          name: PARAM_IS_VALID.name,
          year: PARAM_IS_VALID.year,
          day: PARAM_IS_VALID.day,
          month: PARAM_IS_VALID.month,
          location: PARAM_IS_VALID.location,
          description: PARAM_IS_VALID.description,
          job: PARAM_IS_VALID.job,
          relationship: PARAM_IS_VALID.relationship,
          address: PARAM_IS_VALID.address,
          mobile: PARAM_IS_VALID.mobile,
          gender: PARAM_IS_VALID.gender,
          timeup: PARAM_IS_VALID.timeup,
        };
        if (audio !== '') {
          updateValuesObject.audio = audio;
        }
        const options = {
          if_exists: true,
        };
        models.instance.members.update(queryObject, updateValuesObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      console.log(err);
      if (err)
        res.send({
          status: 'error',
        });
      else
        res.json({
          status: 'ok',
          data: PARAM_IS_VALID,
        });
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
        models.instance.members.find(
          {
            membersid: PARAM_IS_VALID.membersid,
          },
          (err, items) => {
            result = items && items.length > 0 ? items[0] : {};
            callback(err, null);
          }
        );
      },
    ],
    err => {
      if (err)
        res.send({
          status: 'error',
        });
      return res.json({
        status: 'ok',
        data: result,
      });
    }
  );
}

function fetch(req, res) {
  async.series(
    [
      function getMembers(callback) {
        models.instance.members.find({}, (err, items) => {
          if (Array.isArray(items)) {
            const reCreate = items.map(i => {
              const e = JSON.parse(JSON.stringify(i));
              if (e.audio) {
                e.audioRecord = 2;
              } else {
                e.audioRecord = 1;
              }
              if (e.relationship === 'SINGLE') {
                e.relationshipOption = 1;
              }
              if (e.relationship === 'DIVORCE') {
                e.relationshipOption = 2;
              }
              if (e.relationship === 'SINGLEMON') {
                e.relationshipOption = 3;
              }
              return e;
            });
            callback(err, reCreate);
          } else {
            callback(err, []);
          }
        });
      },
    ],
    (err, results) => {
      const pagination = {};
      const params = req.query; // eslint-disable-line
      let dataSource = results[0];

      if (params.sorter) {
        const s = params.sorter.split('_');
        dataSource = dataSource.sort((prev, next) => {
          if (s[1] === 'descend') {
            return next[s[0]] - prev[s[0]];
          }
          return prev[s[0]] - next[s[0]];
        });
      } else {
        dataSource = dataSource.sort((prev, next) => prev.timeup - next.timeup);
      }
      if (params.location) {
        const status = params.location.split(',');
        let filterDataSource = [];
        status.forEach(s => {
          filterDataSource = filterDataSource.concat(
            dataSource.filter(data => data.location === s[0])
          );
        });

        dataSource = filterDataSource;
      }
      if (params.audioRecord) {
        const status = params.audioRecord.split(',');
        let filterDataSource = [];
        status.forEach(s => {
          filterDataSource = filterDataSource.concat(
            dataSource.filter(data => parseInt(data.audioRecord, 10) === parseInt(s[0], 10))
          );
        });

        dataSource = filterDataSource;
      }
      if (params.relationshipOption) {
        const status = params.relationshipOption.split(',');

        let filterDataSource = [];
        status.forEach(s => {
          filterDataSource = filterDataSource.concat(
            dataSource.filter(data => parseInt(data.relationshipOption, 10) === parseInt(s[0], 10))
          );
        });
        dataSource = filterDataSource;
      }
      if (params.unicode) {
        try {
          const code = parseInt(params.unicode, 10);
          if (code > 1000) {
            dataSource = dataSource.filter(e => e.gcode === code);
          } else {
            dataSource = dataSource.filter(e => e.ucode === code);
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (params.timeup) {
        try {
          dataSource = dataSource.filter(e => {
            const timeup = moment(e.timeup)
              .format('DD-MM-YYYY')
              .toString();
            const timeFilter = params.timeup;
            return timeup === timeFilter;
          });
        } catch (e) {
          console.log(e);
        }
      }

      if (err)
        res.send({
          status: 'error',
        });
      else
        res.json({
          status: 'ok',
          data: {
            list: dataSource,
            pagination,
          },
        });
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
      if (err)
        res.send({
          status: 'error',
        });
      return res.json({
        status: 'ok',
        data: PARAM_IS_VALID,
      });
    }
  );
}
function getAllUsers(req, res) {
  let result = [];
  async.series(
    [
      callback => {
        try {
          // eslint-disable-next-line consistent-return
          models.instance.users.find({}, (err, user) => {
            if (user && user.length > 0) {
              const a = JSON.stringify(user);
              const b = JSON.parse(a);
              const arr = [];
              b.forEach(element => {
                const obj = {};
                obj.user_id = element.user_id;
                obj.fullname = element.fullname;
                obj.gender = element.gender;
                obj.age = new Date().getFullYear() - element.dob_year;
                obj.address = element.address;
                obj.avatar = element.avatar;
                obj.createat = element.createat;
                obj.status = element.public;
                arr.push(obj);
                // if (element.public === 'active') arr.push(obj);
              });
              result = arr;
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', data: result });
    }
  );
}

function deleteUser(req, res) {
  // eslint-disable-next-line camelcase
  const { user_id } = req.params;
  let phone = '';
  async.series(
    [
      callback => {
        try {
          // eslint-disable-next-line consistent-return
          models.instance.users.find({}, (err, _user) => {
            if (_user && _user.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              phone = _user[0].phone;
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          const objectUser = {
            user_id: models.uuidFromString(user_id),
          };

          models.instance.users.delete(objectUser, err => {
            callback(err, null);
          });
        } catch (e) {
          console.log(e);
        }
      },
      callback => {
        try {
          const objectPhone = {
            phone,
          };
          models.instance.login.delete(objectPhone, err => {
            callback(err, null);
          });
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      if (err) {
        console.log(err);
        return res.json({ status: 'error' });
      }
      return res.json({
        status: 'ok',
      });
    }
  );
}

function changePublic(req, res) {
  // eslint-disable-next-line camelcase
  const { user_id, status } = req.params;
  async.series(
    [
      callback => {
        try {
          const objectUser = {
            public: status,
          };

          models.instance.users.update(
            { user_id: models.uuidFromString(user_id) },
            objectUser,
            err => {
              callback(err, null);
            }
          );
        } catch (e) {
          console.log(e);
        }
      },
    ],
    err => {
      if (err) {
        console.log(err);
        return res.json({ status: 'error' });
      }
      return res.json({
        status: 'ok',
      });
    }
  );
}

function getMemberById(req, res) {
  let result = {};
  let question = [];
  let title = [];
  let group = [];
  let message = '';
  const { id } = req.params;
  async.series(
    [
      callback => {
        try {
          // eslint-disable-next-line consistent-return
          models.instance.users.find({ user_id: models.uuidFromString(id) }, {}, (err, user) => {
            if (user && user.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              result = user[0];
            } else {
              return res.json({
                status: 'error',
                message: 'Không tìm thấy tài khoản này',
              });
            }
            callback(err, null);
          });
        } catch (error) {
          console.log(error);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          models.instance.profile.find(
            { user_id: models.uuidFromString(id) },
            { select: ['question_id', 'answer'] },
            (err, results) => {
              if (results && results.length > 0) {
                const arr = [];
                results.forEach(element => {
                  const a = JSON.stringify(element);
                  const obj = JSON.parse(a);
                  arr.push(obj);
                });
                question = arr;
              } else {
                message = 'Chưa trả lời câu hỏi';
              }
              callback(err, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          models.instance.question.find({}, (err, results) => {
            if (results && results.length > 0) {
              const arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              title = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          models.instance.group.find({}, (err, results) => {
            if (results && results.length > 0) {
              const arr = [];
              results.forEach(element => {
                arr.push(element);
              });
              group = arr;
            }
            callback(err, null);
          });
        } catch (error) {
          callback(error);
        }
      },
    ],
    err => {
      if (err) {
        console.log(err);
        return res.json({ status: 'error' });
      }
      return res.json({
        status: 'ok',
        data: {
          result,
          question,
          message,
          title,
          group,
          timeline: new Date().getTime(),
        },
      });
    }
  );
}
function updateProfileQuestion(req, res) {
  const PARAM_IS_VALID = {};

  async.series(
    [
      callback => {
        PARAM_IS_VALID.question_id = req.body.question_id;
        PARAM_IS_VALID.answer = req.body.answer;
        callback(null, null);
      },
      callback => {
        try {
          const update_object = {
            answer: PARAM_IS_VALID.answer,
          };
          const object = update_object;
          models.instance.profile.update(
            {
              user_id: models.uuidFromString(req.body.user_id),
              question_id: models.uuidFromString(PARAM_IS_VALID.question_id),
            },
            object,
            { if_exist: true },
            err => {
              if (err) {
                console.log(err);
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function updateProfileUser(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  async.series(
    [
      callback => {
        PARAM_IS_VALID.user_id = params.user_id;
        PARAM_IS_VALID.address = params.address;
        PARAM_IS_VALID.avatar = params.avatar;
        PARAM_IS_VALID.dob_day = params.dateinfo;
        PARAM_IS_VALID.education = {
          education: params.education,
        };
        PARAM_IS_VALID.fullname = params.fullname;
        PARAM_IS_VALID.gender = params.gender;
        PARAM_IS_VALID.height = params.height;
        PARAM_IS_VALID.jobs = {
          jobs: params.jobs,
        };
        PARAM_IS_VALID.dob_month = params.monthinfo;
        PARAM_IS_VALID.weight = params.weight;
        PARAM_IS_VALID.dob_year = params.yearinfo;
        callback(null, null);
      },
      callback => {
        try {
          const update_object = {
            address: PARAM_IS_VALID.address,
            avatar: PARAM_IS_VALID.avatar ? models.uuidFromString(PARAM_IS_VALID.avatar) : null,
            dob_day: PARAM_IS_VALID.dob_day,
            dob_month: PARAM_IS_VALID.dob_month,
            dob_year: PARAM_IS_VALID.dob_year,
            education: PARAM_IS_VALID.education,
            fullname: PARAM_IS_VALID.fullname,
            gender: PARAM_IS_VALID.gender,
            height: PARAM_IS_VALID.height,
            jobs: PARAM_IS_VALID.jobs,
            weight: PARAM_IS_VALID.weight,
          };
          const object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(PARAM_IS_VALID.user_id) },
            object,
            { if_exist: true },
            // eslint-disable-next-line consistent-return
            err => {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function changePass(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  let _salt = '';
  let _hash = '';
  const saltRounds = 10;
  const queries = [];
  let phone = '';
  async.series(
    [
      function(callback) {
        PARAM_IS_VALID.password = params.password;
        PARAM_IS_VALID.newpassword = params.newpassword;
        callback(null, null);
      },
      function(callback) {
        models.instance.users.find(
          { user_id: models.uuidFromString(params.user_id) },
          (err, _user) => {
            if (_user !== undefined && _user.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              phone = _user[0].phone;
            }
            callback(err, null);
          }
        );
      },
      function(callback) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          _salt = salt;
          callback(err, null);
        });
      },
      function(callback) {
        bcrypt.hash(params.newpassword, _salt, (err, hash) => {
          _hash = hash;
          callback(err, null);
        });
      },
      // eslint-disable-next-line func-names
      function(callback) {
        try {
          const update_password_object = {
            password: _hash,
            password_salt: _salt,
          };
          const update_password = () => {
            const object = update_password_object;
            // eslint-disable-next-line no-shadow
            const update = models.instance.login.update(
              { phone, user_id: models.uuidFromString(params.user_id) },
              object,
              { if_exist: true, return_query: true }
            );
            return update;
          };
          queries.push(update_password());
          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    // eslint-disable-next-line consistent-return
    err => {
      if (err) {
        console.log(err);
        return res.json({ status: 'error1' });
      }
      // eslint-disable-next-line no-shadow
      models.doBatch(queries, err => {
        if (err) {
          console.log(err);
          return res.json({ status: 'error2' });
        }
        return res.json({
          status: 'ok',
          message: 'Thay đổi mật khẩu thành công',
          timeline: new Date().getTime(),
        });
      });
    }
  );
}
function updatePhone(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  async.series(
    [
      callback => {
        PARAM_IS_VALID.phone = { '1': params.phone };
        callback(null, null);
      },
      callback => {
        try {
          const update_object = {
            phones: PARAM_IS_VALID.phone,
          };
          const object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(params.user_id) },
            object,
            { if_exist: true },
            err => {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
function updateEmail(req, res) {
  const params = req.body;
  const PARAM_IS_VALID = {};
  async.series(
    [
      callback => {
        PARAM_IS_VALID.email = params.email;
        callback(null, null);
      },
      callback => {
        try {
          const update_object = {
            email: PARAM_IS_VALID.email,
          };
          const object = update_object;
          models.instance.users.update(
            { user_id: models.uuidFromString(params.user_id) },
            object,
            { if_exist: true },
            err => {
              if (err) {
                console.log(err);
                return res.json({ status: 'error' });
              }
              callback(null, null);
            }
          );
        } catch (error) {
          callback(error, null);
        }
      },
    ],
    err => {
      if (err) return res.json({ status: 'error' });
      return res.json({ status: 'ok', timeline: new Date().getTime() });
    }
  );
}
router.post('/form/add', add);
router.put('/form/update', update);
router.get('/fetch', fetch);
router.get('/fetch/:membersid', fetchBy);
router.get('/getalluser', getAllUsers);
router.get('/delete/:user_id', deleteUser);
router.get('/changepublic/:user_id/:status', changePublic);
router.delete('/del/:membersid', del);
router.get('/getmemberbyid/:id', getMemberById);
router.post('/updateprofileuser', updateProfileUser);
router.post('/changepass', changePass);
router.post('/updateemail', updateEmail);
router.post('/updatephone', updatePhone);
router.post('/updateprofilequestion', updateProfileQuestion);
module.exports = router;
