export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/member' },
      {
        name: 'track',
        icon: 'form',
        path: '/track',
        routes: [
          {
            path: '/track',
            redirect: '/track/list',
          },
          {
            path: '/track/form',
            name: 'track',
            component: './Track/BasicForm',
          },
          {
            path: '/track/list',
            name: 'list',
            component: './Track/TableList',
          },
          {
            path: '/track/edit/:track_id',
            component: './Track/EditForm',
          },
          {
            path: '/track/detail/:track_id',
            component: './Track/EditForm',
          },
        ],
      },
      {
        name: 'question',
        icon: 'question',
        path: '/question',
        routes: [
          {
            path: '/question',
            redirect: '/question/form',
          },
          {
            path: '/question/form',
            name: 'form',
            component: './Question/BasicForm',
          },
          {
            path: '/question/list',
            name: 'list',
            component: './Question/TableList',
          },
          {
            path: '/question/edit/:question_id',
            component: './Question/EditForm',
          },
        ],
      },
      {
        name: 'group',
        icon: 'question-circle',
        path: '/group',
        routes: [
          {
            path: '/group',
            redirect: '/group/form',
          },
          {
            path: '/group/form',
            name: 'form',
            component: './Group/BasicForm',
          },
        ],
      },
      {
        name: 'members',
        icon: 'team',
        path: '/members',
        routes: [
          {
            path: '/members',
            redirect: '/members/basic',
          },
          {
            path: '/members/basic',
            name: 'searchtable',
            component: './Members/TableList',
          },
        ],
      },
      {
        name: 'member',
        icon: 'profile',
        path: '/member',
        routes: [
          {
            path: '/member/list',
            name: 'Thành viên',
            component: './UserMember/ListMember',
          },
          {
            path: '/member/detail',
            component: './DetailMember',
            routes: [
              {
                path: '/member/detail',
                redirect: '/member/detail/question',
              },
              {
                path: '/member/detail/question',
                component: './DetailMember/Question',
              },
              {
                path: '/member/detail/changeinfo',
                component: './DetailMember/ChangeInfo',
              },
            ],
          },
          {
            path: '/member',
            redirect: '/member/basic',
          },
          {
            path: '/member/basic',
            name: 'basiclist',
            component: './Member/BasicList',
            routes: [
              {
                path: '/member/center',
                redirect: '/member/cartlist',
              },
            ],
          },
          {
            path: '/member/cart-list',
            name: 'cardlist',
            component: './Member/CardList',
          },
          {
            path: '/member/table-list',
            name: 'searchtable',
            component: './Member/TableList',
          },
          {
            path: '/member/center/:user_id',
            component: './Member/Center/Center',
            routes: [
              {
                path: '/member/center/:user_id',
                redirect: '/member/center/:user_id/articles',
              },
              {
                path: '/member/center/:user_id/articles',
                component: './Member/Center/Articles',
              },
              {
                path: '/member/center/:user_id/applications',
                component: './Member/Center/Applications',
              },
              {
                path: '/member/center/:user_id/projects',
                component: './Member/Center/Projects',
              },
            ],
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        path: '/online',
        name: 'online',
        icon: 'global',
        routes: [
          { path: '/online', redirect: '/online/menu/list' },
          {
            path: '/online/menu/list',
            name: 'menu',
            component: './Website/Menu/TableList.js',
          },
          {
            path: '/online/menu/add',
            component: './Website/Menu/BasicForm.js',
          },
          {
            path: '/online/menu/item/add',
            component: './Website/Menu/MenuItem.js',
          },
          {
            path: '/online/rule/add',
            component: './Website/Rule/BasicForm.js',
          },
          {
            path: '/online/rule/list',
            component: './Website/Rule/TableList.js',
          },
        ],
      },
      {
        path: '/settings',
        name: 'settings',
        icon: 'setting',
        component: './Settings',
      },
      {
        path: '/image/lazy-image',
        component: './LazyImage',
      },
      {
        component: '404',
      },
    ],
  },
];
