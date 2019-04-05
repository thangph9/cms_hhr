import { message } from 'antd';
import {
  apiMenuItemAdd,
  apiMenuItemList,
  apiMenuItemUpdate,
  apiMenuItemDelete,
} from '@/services/api';

export default {
  namespace: 'menuItem',

  state: {
    table: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(apiMenuItemList);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchReducer',
          payload: response.data,
        });
      } else {
        message.warn('Không thấy dữ liệu!');
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(apiMenuItemAdd, payload);
      if (response.status === 'ok') {
        message.success('Đã xong !');
        yield put({
          type: 'addReducer',
          payload: response.data,
        });
      } else {
        message.error('Không thêm được! ');
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(apiMenuItemUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được update!');
        yield put({
          type: 'updateReducer',
          payload: response.data,
        });
      } else {
        message.error('Không update được!');
      }
    },
    *del({ payload }, { call }) {
      const response = yield call(apiMenuItemDelete, payload);
      if (response.status === 'ok') {
        message.success('Đã xoá!');
      } else {
        message.error('Không Xoá được! ');
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    fetchReducer(state, action) {
      return {
        ...state,
        table: {
          list: action.payload,
          pagination: {},
        },
      };
    },
    addReducer(state, action) {
      const { list } = state.table;
      list.unshift(action.payload);
      return {
        ...state,
      };
    },
    updateReducer(state) {
      return {
        ...state,
      };
    },
  },
};
