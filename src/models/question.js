// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitQuestion, fetchQuestion, removeQuestion } from '@/services/api';

export default {
  namespace: 'question',

  state: {
    data: {},
    table: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(submitQuestion, payload);
      const msg = payload.type === 'add' ? 'thêm mới' : 'update';
      if (response.status === 'ok') {
        message.success(`Thông tin đã được ${msg}!`);
      } else {
        message.error(`Không thể ${msg} thông tin!`);
      }
      yield put({
        type: 'saveReducer',
        payload: response || {},
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchQuestion, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchReducer',
          payload: response || {},
        });
      } else {
        message.error('Không lấy được dữ liệu !');
      }
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeQuestion, payload);
      const res = JSON.parse(response);
      if (res.status === 'ok') {
        message.success('Câu hỏi đã được xoá');
      } else {
        message.error('Không thể xoá câu hỏi!');
      }
    },
  },

  reducers: {
    saveReducer(state, { payload }) {
      console.log(payload);
      return {
        ...state,
      };
    },
    fetchReducer(state, { payload }) {
      return {
        ...state,
        table: payload.data,
      };
    },
  },
};
