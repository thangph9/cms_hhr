import { queryCurrent, fetch, removeUser, updateUser, addUser, queryUserBy } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    member: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetch);
      yield put({
        type: 'fetchUser',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchBy(payload, { call, put }) {
      const response = yield call(queryUserBy, payload);
      yield put({
        type: 'fetchByReducer',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeUser : updateUser;
      } else {
        callback = addUser;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    fetchUser(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    fetchByReducer(state, action) {
      return {
        ...state,
        member: action.payload.data,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
