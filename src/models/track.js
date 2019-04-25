// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitTrackAdd,
  fetchTrackByID,
  submitTrackUpdate,
  fetchTrack,
  delTrack,
} from '@/services/api';

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
    table: {},
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(submitTrackAdd, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thêm mới');
        yield put({
          type: 'saveAdd',
          payload: {
            add: true,
          },
        });
      } else {
        message.error('Không thể thêm thông tin');
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(submitTrackUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được thay đổi');
      } else {
        message.error('Không thể sửa đổi thông tin!');
      }
    },
    *fetchByID({ payload }, { call, put }) {
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
    *remove({ payload }, { call }) {
      const response = yield call(delTrack, payload);
      if (response.status === 'ok') {
        message.success('Thành viên đã xoá!');
      } else {
        message.error('Không thể thêm thông tin');
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
    saveAdd(state, { payload }) {
      return {
        ...state,
        add: payload.add,
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
        table: payload,
      };
    },
  },
};
