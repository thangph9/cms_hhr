// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitQuestionUpdate,
  submitQuestion,
  fetchQuestion,
  fetchQuestionBy,
  delQuestion,
} from '@/services/api';

export default {
  namespace: 'question',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    question: {},
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *submitRegularForm({ payload }, { call }) {
      const response = yield call(submitQuestion, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thêm mới');
      } else {
        message.error('Không thể thêm thông tin');
      }
    },
    *submitUpdate({ payload }, { call }) {
      const response = yield call(submitQuestionUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thay đổi');
      } else {
        message.error('Không thể sửa đổi thông tin!');
      }
    },
    *fetch(_, { call, put }) {
      const response = yield call(fetchQuestion);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchReducer',
          payload: response.data,
        });
      } else {
        message.error('Không lấy được dữ liệu !');
      }
    },
    *fetchBy({ payload }, { call, put }) {
      const response = yield call(fetchQuestionBy, payload);
      if (response.status === 'ok') {
        if (Array.isArray(response.data)) {
          yield put({
            type: 'fetchByReducer',
            payload: response.data,
          });
        } else {
          message.error('Lỗi dữ liệu không đúng !');
        }
      } else {
        message.error('Không lấy được dữ liệu !');
      }
    },
    *delQuestion({ payload }, { call }) {
      const response = yield call(delQuestion, payload);
      if (response.status === 'ok') {
        message.success('Câu hỏi đã được xoá ');
      } else {
        message.error('Không thể xoá câu hỏi!');
      }
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    fetchReducer(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload,
        },
      };
    },
    fetchByReducer(state, { payload }) {
      return {
        ...state,
        question: payload,
      };
    },
  },
};
