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
    table: {
      list: [],
      pagination: {},
    },
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
    *fetch(_, { call, put }) {
      const response = yield call(fetchMembers);
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
