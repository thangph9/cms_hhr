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
      const { group, data } = payload;
      const response = yield call(submitQuestion, data);
      const msg = data.action === 'add' ? 'thêm mới' : 'update';
      if (response.status === 'ok') {
        response.group = group ? group.list : null;
        message.success(`Thông tin đã được ${msg}!`);
      } else {
        message.error(`Không thể ${msg} thông tin!`);
      }
      if (data.action === 'add') {
        yield put({
          type: 'saveReducer',
          payload: response || {},
        });
      } else {
        yield put({
          type: 'updateReducer',
          payload: response || {},
        });
      }
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
    *remove({ payload }, { call, put }) {
      const response = yield call(removeQuestion, payload);
      const res = JSON.parse(response);
      if (res.status === 'ok') {
        message.success('Câu hỏi đã được xoá');
      } else {
        message.error('Không thể xoá câu hỏi!');
      }
      yield put({
        type: 'removeReducer',
        payload: res || {},
      });
    },
  },

  reducers: {
    saveReducer(state, { payload }) {
      console.log('add');
      const {
        table: { list, pagination },
      } = state;
      const { data, group } = payload;
      const newGroup = group.filter(k => k.group_id === data.group_id);
      data.group = newGroup[0] ? newGroup[0].title : null;
      list.unshift(data);
      const newTable = {
        list,
        pagination,
      };
      return {
        ...state,
        table: newTable,
      };
    },
    updateReducer(state, { payload }) {
      console.log('update');
      const {
        table: { list, pagination },
      } = state;
      const { data, group } = payload;
      const newList = [];
      list.forEach((e, i) => {
        if (e.question_id === data.question_id) {
          const newGroup = group.filter(k => k.group_id === data.group_id);
          data.group = newGroup[0] ? newGroup[0].title : null;
          newList[i] = data;
        } else {
          newList[i] = e;
        }
      });
      const newTable = {
        list: newList,
        pagination,
      };
      return {
        ...state,
        table: newTable,
      };
    },
    fetchReducer(state, { payload }) {
      return {
        ...state,
        table: payload.data,
      };
    },
    removeReducer(state, { payload }) {
      const {
        table: { list, pagination },
      } = state;
      const { data } = payload;
      const newList = list.filter(e => e.question_id !== data.question_id);
      const newTable = {
        list: newList,
        pagination,
      };
      return {
        ...state,
        table: newTable,
      };
    },
  },
};
