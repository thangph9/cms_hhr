import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { message } from 'antd';
import {
  apiMenuList,
  apiMenuAdd,
  apiMenuUpdate,
  apiMenuDelete,
  apiMenuDeleteItem,
  apiMenuItemUpdate,
} from '@/services/api';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
    table: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority } = payload;
      const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(apiMenuList);
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
      const response = yield call(apiMenuAdd, payload);
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
      const response = yield call(apiMenuUpdate, payload);
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
    *updateItem({ payload }, { call, put }) {
      const response = yield call(apiMenuItemUpdate, payload);
      if (response.status === 'ok') {
        message.success('Thông tin đã được update!');
        yield put({
          type: 'updateItemReducer',
          payload: response.data,
        });
      } else {
        message.error('Không update được!');
      }
    },

    *remove({ payload }, { call }) {
      const response = yield call(apiMenuDelete, payload);
      if (response.status === 'ok') {
        message.success('Đã xoá!');
      } else {
        message.error('Không Xoá được! ');
      }
    },
    *removeMenuItem({ payload }, { call, put }) {
      const response = yield call(apiMenuDeleteItem, payload);
      const res = JSON.parse(response);
      if (res.status === 'ok') {
        message.success('Đã xoá!');
        yield put({
          type: 'removeMenuItemReducer',
          payload,
        });
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
      const { payload } = action;
      const newMenu = {
        parent: 1,
        name: payload.name,
        menuId: payload.menuId.toString(),
        key: payload.menuId,
      };

      list.unshift(newMenu);
      return {
        ...state,
      };
    },
    updateReducer(state, action) {
      const { list, pagination } = state.table;
      const { menuId, menuItem, orderby } = action.payload;
      menuItem.orderby = orderby;
      const newList = [];

      list.forEach((e, i) => {
        let newChild = [];
        if (e.menuId === menuId) {
          const { children } = e;
          if (Array.isArray(children)) {
            menuItem.key = menuId.concat(children.length + 1);
            newChild = children;
            menuItem.menuId = menuId;
            newChild.push(menuItem);
          } else {
            menuItem.key = menuId.concat(Math.random());
            menuItem.menuId = menuId;
            newChild.push(menuItem);
          }
        } else {
          newChild = e.children;
        }
        newList[i] = { ...e, children: newChild };
      });
      return {
        ...state,
        table: { list: newList, pagination },
      };
    },
    updateItemReducer(state, action) {
      const { list, pagination } = state.table;
      const { payload } = action;
      list.forEach(e => {
        if (e.menuId === payload.menuId) {
          const { children } = e;

          if (Array.isArray(children)) {
            const child = [];
            children.forEach((k, j) => {
              if (k.menuItemId === payload.menuItemId) {
                child[j] = payload;
              } else {
                child[j] = k;
              }
            });

            e.children = child;
          }
          // console.log(e.menuId, payload.menuId,e.children);
        }
      });
      return {
        ...state,
        table: { list, pagination },
      };
    },
    removeMenuItemReducer(state, action) {
      const { list } = state.table;
      const { menuid, menuitemid } = action.payload;
      list.forEach(e => {
        if (menuid === e.menuId.toString()) {
          e.children = e.children.filter(k => menuitemid !== k.menuItemId.toString());
        }
      });
      return {
        ...state,
      };
    },
  },
};
