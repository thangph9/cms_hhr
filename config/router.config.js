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
        name: 'upload',
        icon: 'form',
        path: '/upload',
        routes: [
          {
            path: '/upload',
            redirect: '/upload/track',
          },
          {
            path: '/upload/track',
            name: 'track',
            component: './Upload/BasicForm',
          },
          {
            path: '/upload/list',
            name: 'list',
            component: './Upload/CardList',
          },
          {
            path: '/upload/edit/:track_id',
            component: './Upload/EditForm',
          },
          {
            path: '/upload/detail/:track_id',
            component: './Upload/EditForm',
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
        component: '404',
      },
    ],
  },
];
