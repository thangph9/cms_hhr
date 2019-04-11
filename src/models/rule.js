import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      if (response.status === 'ok') {
        message.success('Đã xong !');
        yield put({
          type: 'addReducer',
          payload: response.data,
        });
      } else {
        message.error('Không thêm được! ');
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      const res = JSON.parse(response);
      if (res.status === 'ok') {
        message.success('Đã xoá!');
        yield put({
          type: 'removeReducer',
          payload,
        });
      } else {
        message.error('Không Xoá được! ');
      }
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được update!');
        yield put({
          type: 'updateReducer',
          payload: response.data,
        });
      } else {
        message.error('Không update được!');
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    addReducer(state, action) {
      const {
        data: { list },
      } = state;
      list.unshift(action.payload);
      return {
        ...state,
      };
    },
    removeReducer(state, action) {
      const {
        data: { list, pagination },
      } = state;
      const { name } = action.payload;
      const newList = list.filter(e => e.name !== name);
      return {
        ...state,
        data: {
          list: newList,
          pagination,
        },
      };
    },
    updateReducer(state, action) {
      const {
        data: { list, pagination },
      } = state;
      const { name } = action.payload;
      const newList = [];
      list.forEach((e, i) => {
        if (e.name === name) {
          newList[i] = action.payload;
        } else {
          newList[i] = e;
        }
      });
      return {
        ...state,
        data: {
          list: newList,
          pagination,
        },
      };
    },
  },
};
