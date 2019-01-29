export default [
  // user
  {
    path: '/login',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/login', component: './Login' }],
  },
  {
    path: '/test',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/test', component: './User/RegisterResult.js' }],
  },
  // front-end
  {
    path: '/',
    component: '../layouts/HomeLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['member'],
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/home', component: './HomePage/NewFeed' },
      { path: '/profile', component: './HomePage/ProfileUser' },
      { path: '/registerresult', component: './ResgisterResult' },
      {
        component: '404',
      },
    ],
  },
  {
    component: '404',
  },
];
