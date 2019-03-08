// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitGroup, getGroup } from '@/services/api';

export default {
  namespace: 'group',

  state: {
    group: {},
    getgroup: {},
  },
  effects: {
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(submitGroup, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thêm mới');
      } else {
        message.error('Không thể thêm thông tin');
      }
      yield put({
        type: 'addGroup',
        payload: response || {},
      });
    },
    *getgroup({ payload }, { call, put }) {
      const response = yield call(getGroup, payload);
      yield put({
        type: 'getGroup',
        payload: response || {},
      });
    },
  },

  reducers: {
    addGroup(state, action) {
      return {
        ...state,
        group: action.payload,
      };
    },
    getGroup(state, action) {
      return {
        ...state,
        getgroup: action.payload,
      };
    },
  },
};
