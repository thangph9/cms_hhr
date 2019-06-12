// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitMembers,
  submitMembersUpdate,
  fetchMembers,
  fetchMembersBy,
  delMembers,
  searchMembers,
  getAllUser,
  deleteUser,
  changePublic,
  getMemberById,
  updateProfileUser,
  updateProfileQuestion,
} from '@/services/api';

export default {
  namespace: 'members',

  state: {
    list: [],
    data: {},
    table: {
      list: [],
      pagination: {},
    },
    getalluser: [],
    getmemberbyid: {},
    updateprofileuser: {},
    updateprofilequestion: {},
  },
  effects: {
    *add({ payload }, { call, put }) {
      const response = yield call(submitMembers, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thêm mới');
      } else {
        message.error('Không thể thêm thông tin');
      }
      yield put({
        type: 'addMembersReducer',
        payload: response.data || {},
      });
    },
    *getalluser({ payload }, { call, put }) {
      const response = yield call(getAllUser, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'getAllUser',
          payload: response.data,
        });
      } else {
        message.error('Không tìm thấy dữ liệu');
      }
    },
    *deleteuser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (response.status === 'ok') {
        message.success('Đã xóa!');
        yield put({
          type: 'deleteUser',
          payload,
        });
      } else {
        message.error('Xóa không thành công');
      }
    },
    *changepublic({ payload }, { call, put }) {
      const response = yield call(changePublic, payload);
      if (response.status === 'ok') {
        message.success('Đã chỉnh sửa!');
        yield put({
          type: 'changePublic',
          payload,
        });
      } else {
        message.error('Thay đổi không thành công');
      }
    },
    *getmemberbyid({ payload }, { call, put }) {
      const response = yield call(getMemberById, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'getMemberById',
          payload: response.data,
        });
      } else {
        message.error('Không tìm thấy tài khoản này');
      }
    },
    *updateprofilequestion({ payload }, { call, put }) {
      const response = yield call(updateProfileQuestion, payload);
      if (response && response.status === 'ok') {
        message.success('Thay đổi dữ liệu thành công !');
        yield put({
          type: 'updateProfileQuestion',
          payload,
        });
      } else {
        message.error('Thay đổi thất bại !');
      }
    },
    *updateprofileuser({ payload }, { call, put }) {
      const response = yield call(updateProfileUser, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'updateProfileUser',
          payload,
        });
        message.success('Thay đổi thông tin thành công !');
      } else {
        message.error('Có lỗi xảy ra !');
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(submitMembersUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thay đổi');
      } else {
        message.error('Không thể thêm thông tin');
      }
      yield put({
        type: 'saveMembersReducer',
        payload: response.data || {},
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchMembers, payload);
      yield put({
        type: 'getMembersReducer',
        payload: response.data || {},
      });
    },
    *fetchBy({ payload }, { call, put }) {
      const response = yield call(fetchMembersBy, payload);
      yield put({
        type: 'getMembersByReducer',
        payload: response.data || {},
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(searchMembers, payload);
      yield put({
        type: 'getMembersReducer',
        payload: response.data || {},
      });
    },
    *del({ payload }, { call }) {
      const response = yield call(delMembers, payload);
      if (response.status === 'ok') {
        message.success('Thành viên đã xoá!');
      } else {
        message.error('Không thể thêm thông tin');
      }
    },
  },

  reducers: {
    addMembersReducer(state, action) {
      const { list } = state.table;
      list.unshift(action.payload);
      return {
        ...state,
        data: action.payload,
      };
    },
    getAllUser(state, action) {
      return {
        ...state,
        getalluser: action.payload,
      };
    },
    updateProfileQuestion(state, action) {
      const newgetuser = state.getmemberbyid;
      if (newgetuser.question) {
        const i = newgetuser.question.findIndex(
          element => element.question_id === action.payload.question_id
        );
        if (i === -1) {
          newgetuser.question.push({
            question_id: action.payload.question_id,
            answer: action.payload.answer,
          });
        } else {
          newgetuser.question[i] = {
            question_id: action.payload.question_id,
            answer: action.payload.answer,
          };
        }
      }
      const a = JSON.stringify(newgetuser);
      return {
        ...state,
        getmemberbyid: JSON.parse(a),
      };
    },
    deleteUser(state, action) {
      const oldState = state.getalluser;
      const a = JSON.stringify(oldState);
      const b = JSON.parse(a);
      const newState = b.filter(ele => ele.user_id !== action.payload);
      return {
        ...state,
        getalluser: newState,
      };
    },
    changePublic(state, action) {
      const oldState = state.getalluser;
      const a = JSON.stringify(oldState);
      const b = JSON.parse(a);
      const itemFind = b.findIndex(ele => ele.user_id === action.payload.user_id);
      b[itemFind].status = action.payload.status;
      return {
        ...state,
        getalluser: b,
      };
    },
    getMemberById(state, action) {
      return {
        ...state,
        getmemberbyid: action.payload,
      };
    },
    updateProfileUser(state, action) {
      const oldProps = state.getmemberbyid;
      oldProps.result.address = action.payload.address;
      oldProps.result.gender = action.payload.gender;
      oldProps.result.dob_day = action.payload.dateinfo;
      oldProps.result.dob_month = action.payload.monthinfo;
      oldProps.result.dob_year = action.payload.yearinfo;
      oldProps.result.fullname = action.payload.fullname;
      oldProps.result.height = action.payload.height;
      oldProps.result.weight = action.payload.weight;
      oldProps.result.education = { education: action.payload.education };
      oldProps.result.jobs = { jobs: action.payload.jobs };
      oldProps.result.avatar = action.payload.avatar;
      const newProps = JSON.stringify(oldProps);
      return {
        ...state,
        getmemberbyid: JSON.parse(newProps),
      };
    },
    saveMembersReducer(state, action) {
      const { list } = state.table;
      list.map((e, i) => {
        if (e.membersid === action.payload.membersid) {
          list[i] = action.payload;
        }
        return true;
      });
      return {
        ...state,
        data: action.payload,
      };
    },
    getMembersReducer(state, action) {
      return {
        ...state,
        table: action.payload,
      };
    },
    getMembersByReducer(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
