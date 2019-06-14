/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const moment = require('moment'); // eslint-disable-line
const models = require('express-cassandra');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const usersDemo = [
  {
    user_id: 'a0a8c0d5-88b7-4d2a-8015-51952e6748e2',
    address: 'Đông Anh - Hà Nội',
    avatar: 'cc81efc3-9957-4c15-abc5-b2845602e968',
    country: null,
    description: null,
    distance: null,
    dob_day: 27,
    dob_month: 6,
    public: 'active',
    dob_year: 1997,
    email: 'trjvjp97@gmail.com',
    fullname: 'Nguyễn Hữu Trí ',
    gender: 'male',
    height: '177',
    weight: '72',
    hhr_goal: null,
    phone: '0373962095',
    uniqueid: null,
    video: null,
    jobs: { jobs: 'Ở nhà' },
    education: { education: 'Đại học' },
    audio: null,
    phones: { '1': '0373962095' },
    createat: '2019-03-14T14:59:27.728Z',
  },
];

const questionDemo = [
  {
    question_id: '422f932a-e578-4338-bf23-fcee7110b804',
    type: '1',
    title: 'Nơi ở hiện nay của bạn?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: '610c45e6-4dcd-4850-870e-215f90c85f19',
    type: '1',
    title: 'Bạn nghĩ thể nào về startup?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: 'e79bb30a-50e1-4ba5-a887-7815e9d6f3f3',
    type: '2',
    title: 'Bạn có đi học đại học?',
    answer: ['Có', 'Không'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '26eff392-319b-417a-8e21-614f077033b3',
    type: '1',
    title: 'Nhà bạn có mấy người ?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: '477eb320-6085-4fc0-bbd4-f4bff0c0a284',
    type: '2',
    title: 'Bạn có hay đi xem phim ko?',
    answer: ['Có', 'Không', 'Ít đi xem'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: 'b1c27a09-0fc7-457a-9e62-01fe0a14c40d',
    type: '3',
    title: 'Bạn đã ra nước ngoài chưa?',
    answer: ['Chưa đi đâu cả', 'Đã đi châu Mỹ', 'Đã đi châu Á', 'Đã đi châu Âu'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '8ddcb95e-5458-40f3-b086-897252089522',
    type: '2',
    title: 'Bạn có thích đọc sách không?',
    answer: ['Có', 'Không', 'Rất ít đọc'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '9225436e-067b-4f9e-ab5c-e776ed4839a3',
    type: '1',
    title: 'Bạn cao bao nhiêu ? ',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '69b7223a-04c2-4058-b1ca-165371d1631a',
    type: '2',
    title: 'Bạn có đeo kính ?',
    answer: ['Có', 'Không'],
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'dfb0957e-b0c5-40ac-9a5c-b92cffb0b261',
    type: '2',
    title: 'Bạn có hay nghe radio?',
    answer: ['Không bao giờ', 'Thường xuyên', 'Ít khi'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '784a526d-56e7-4872-9568-b14796bb8546',
    type: '2',
    title: 'Bạn hay đi làm bằng phương tiên gì ?',
    answer: ['Xe bus', 'Xe máy', 'Ô tô'],
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: '0fe56740-75b8-49de-a50d-c839703c00ff',
    type: '1',
    title: 'Bạn có đang sống cùng gia đình?',
    answer: null,
    group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf',
  },
  {
    question_id: 'cbd406af-aefd-4422-8f70-bb268cdf7a1b',
    type: '2',
    title: 'Bạn có hay đi du lịch?',
    answer: ['Không đi bao giờ', 'Đi nhiều', 'Đi ít'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: 'eeea1051-4ad0-40b2-bba8-a02bd7a7c84f',
    type: '1',
    title: 'Nhà bạn đang ở?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'a8c7abe0-6ce2-48d0-b744-bbef9e8a9376',
    type: '1',
    title: 'Khi nào bạn kết hôn?',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '9cb6854d-9427-4320-b0a1-2096761f4a92',
    type: '1',
    title: 'Quê gốc bạn ở đâu?',
    answer: null,
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: 'd1928c39-d17f-4695-b30f-dc5fa2795d51',
    type: '2',
    title: 'Bạn đang có công việc ổn đinh ?',
    answer: ['Có', 'Không', 'Đang làm việc tự do'],
    group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3',
  },
  {
    question_id: '7ede6586-0cb8-4af7-a970-f4786632c049',
    type: '1',
    title: 'Bạn nặng bao nhiêu ? ',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '83ef5bd7-57e8-48ef-b631-13886af117aa',
    type: '2',
    title: 'Bạn có hay đi phượt xa cùng bạn bè?',
    answer: ['Có', 'Không', 'Ít khi'],
    group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5',
  },
  {
    question_id: '3aba89b9-e9d4-4dff-bdb4-c89a29e838d6',
    type: '1',
    title: 'Nêu đi du lịch thì bạn thích đến đâu nhất?',
    answer: null,
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
  {
    question_id: '09050540-dd87-4087-a46e-e01086e57678',
    type: '2',
    title: 'Bạn có thích ăn sôcola ? ',
    answer: ['Có', 'Không', 'Ít khi ăn'],
    group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd',
  },
];

const profileDemo = [];

const groupDemo = [
  { group_id: '7f9572a3-8bd0-41d1-aca7-ae97426d9da5', title: 'Nhóm group số 4' },
  { group_id: '4aa1e317-b37e-4200-8e2b-bb04537bfddd', title: 'Nhóm group số 3' },
  { group_id: '3c6de2ec-7521-4990-acdf-176caa967ea3', title: 'Nhóm group số 2' },
  { group_id: 'aa3ec977-cf71-4dd1-afdb-960f3faca6cf', title: 'Nhóm group số 1' },
];

//----------------------------

function getAllUsers(req, res) {
  let result = [];
  async.series(
    [
      callback => {
        try {
          const a = JSON.stringify(usersDemo);
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
            // if(element.public==='active') arr.push(obj);
          });
          result = arr;
          callback(null, null);
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
  return res.json({
    status: 'ok',
  });
}

function changePublic(req, res) {
  return res.json({
    status: 'ok',
  });
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
          result = usersDemo.find(ele => ele.user_id.toString() === id.toString());
          if (!result) {
            return res.json({
              status: 'error',
              message: 'Không tìm thấy tài khoản này',
            });
          }
          callback(null, null);
        } catch (error) {
          console.log(error);
          callback(null, null);
          res.send({ status: 'error' });
        }
      },
      callback => {
        try {
          const profile = profileDemo.filter(ele => ele.user_id.toString() === id.toString());
          if (profile) {
            const arr = [];
            profile.forEach(element => {
              const a = JSON.stringify(element);
              const obj = JSON.parse(a);

              arr.push(obj);
            });
            question = arr;
          } else {
            message = 'Chưa trả lời câu hỏi';
          }
          callback(null, null);
        } catch (error) {
          callback(error, null);
        }
      },
      callback => {
        try {
          const arr = [];
          questionDemo.forEach(element => {
            arr.push(element);
          });
          title = arr;
          callback(null, null);
        } catch (error) {
          callback(error);
        }
      },
      callback => {
        try {
          const arr = [];
          groupDemo.forEach(element => {
            arr.push(element);
          });
          group = arr;
          callback(null, null);
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
  return res.json({ status: 'ok', timeline: new Date().getTime() });
}
function updateProfileUser(req, res) {
  return res.json({ status: 'ok', timeline: new Date().getTime() });
}
function changePass(req, res) {
  return res.json({
    status: 'ok',
    message: 'Thay đổi mật khẩu thành công',
    timeline: new Date().getTime(),
  });
}
function updatePhone(req, res) {
  return res.json({ status: 'ok', timeline: new Date().getTime() });
}
function updateEmail(req, res) {
  return res.json({ status: 'ok', timeline: new Date().getTime() });
}
export default {
  'GET /api/members/getalluser': getAllUsers,
  'GET /api/members/delete/:user_id': deleteUser,
  'GET /api/members/getmemberbyid/:id': getMemberById,
  'GET /api/members/changepublic/:user_id/:status': changePublic,
  'POST /api/members/updateprofileuser': updateProfileUser,
  'POST /api/members/changepass': changePass,
  'POST /api/members/updateemail': updateEmail,
  'POST /api/members/updatephone': updatePhone,
  'POST /api/members/updateprofilequestion': updateProfileQuestion,
};
