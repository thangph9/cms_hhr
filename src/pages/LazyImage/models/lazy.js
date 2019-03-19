// import { message } from 'antd';
import { lazyImages } from '@/services/api';

export default {
  namespace: 'lazy',

  state: {
    list: [],
    data: {},
    table: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(lazyImages);
      yield put({
        type: 'lazyReducer',
        payload: response || [],
      });
    },
  },
  reducers: {
    lazyReducer(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
