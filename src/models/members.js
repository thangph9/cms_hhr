// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitMembers,
  submitMembersUpdate,
  fetchMembers,
  fetchMembersBy,
  delMembers,
} from '@/services/api';

export default {
  namespace: 'members',

  state: {
    list: [],
    data: {},
  },
  effects: {
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(submitMembers, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thêm mới');
      } else {
        message.error('Không thể thêm thông tin');
      }
      yield put({
        type: 'addMembersReducer',
        payload: response || {},
      });
    },
    *submitUpdateForm({ payload }, { call, put }) {
      const response = yield call(submitMembersUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thay đổi');
      } else {
        message.error('Không thể thêm thông tin');
      }
      yield put({
        type: 'saveMembersReducer',
        payload: response || {},
      });
    },
    *getMembers(_, { call, put }) {
      const response = yield call(fetchMembers);
      yield put({
        type: 'getMembersReducer',
        payload: response || {},
      });
    },
    *getMembersBy({ payload }, { call, put }) {
      const response = yield call(fetchMembersBy, payload);
      yield put({
        type: 'getMembersByReducer',
        payload: response || {},
      });
    },
    *delMembersBy({ payload }, { call }) {
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
      return {
        ...state,
        data: action.payload,
      };
    },
    saveMembersReducer(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getMembersReducer(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getMembersByReducer(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
