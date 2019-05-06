// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitGroup, fetchGroup, removeGroup } from '@/services/api';

export default {
  namespace: 'group',

  state: {
    table: {
      list: [],
      pagination: {},
    },
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchGroup, payload);
      yield put({
        type: 'fetchReducer',
        payload: response || {},
      });
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeGroup, payload);
      const res = JSON.parse(response);
      if (res.status === 'ok') {
        message.success(`Thông tin đã được xoá!`);
      } else {
        message.error(`Không thể xoá thông tin!`);
      }
    },
    *save({ payload }, { call, put }) {
      const response = yield call(submitGroup, payload);
      const msg = payload.type === 'add' ? 'thêm mới ' : 'update';
      if (response.status === 'ok') {
        message.success(`Thông tin đã được ${msg}!`);
      } else {
        message.error(`Không thể {msg} thông tin!`);
      }
      yield put({
        type: 'saveReducer',
        payload: { ...response, type: payload.type },
      });
    },
  },

  reducers: {
    fetchReducer(state, action) {
      const { data } = action.payload;
      return {
        ...state,
        table: data,
      };
    },
    saveReducer(state, action) {
      console.log(action.payload);
      return {
        ...state,
      };
    },
    removeReducer(state, action) {
      console.log(action.payload);
      return {
        ...state,
      };
    },
  },
};
