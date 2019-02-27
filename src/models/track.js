// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitTrackAdd, fetchTrackByID, submitTrackUpdate, fetchTrack } from '@/services/api';

export default {
  namespace: 'track',

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
      const response = yield call(submitTrackAdd, payload);
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
    *fetchTrackByID({ payload }, { call, put }) {
      const response = yield call(fetchTrackByID, payload);
      let track = {};
      if (response.status === 'ok') {
        track = response.data;
      } else {
        message.error('Không lấy được dữ liệu!');
      }
      yield put({
        type: 'fetchTrackByIDReducer',
        payload: track,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchTrack, payload);
      let track = [];
      if (response.status === 'ok') {
        track = response.data;
      } else {
        message.error('Không lấy được dữ liệu!');
      }
      yield put({
        type: 'fetchReducer',
        payload: track,
      });
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
    fetchTrackByIDReducer(state, { payload }) {
      return {
        ...state,
        track: { ...payload },
      };
    },
    fetchReducer(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};
