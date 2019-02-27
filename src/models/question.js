// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitTrackUpdate, submitQuestion } from '@/services/api';

export default {
  namespace: 'question',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    track: {},
    list: [],
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
      const response = yield call(submitTrackUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thay đổi');
      } else {
        message.error('Không thể sửa đổi thông tin!');
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
  },
};
