export default {
  'GET /api/menu/fetch': {
    status: 'ok',
    data: [
      {
        key: 1,
        menuId: 'uuid',
        parent: 1,
        name: 'Home Page 01',
        children: [
          {
            key: 11,
            menuItemId: 'uuid01',
            name: '0-0-1',
            path: '/search-list',
            icon: 'user',
            authority: ['member', 'user'],
            menuId: 'uuid',
          },
          {
            key: 12,
            menuItemId: 'uuid02',
            name: '0-0-2',
            path: '/question',
            icon: 'global',
            authority: ['gust'],
            menuId: 'uuid',
          },
        ],
      },
      {
        key: 2,
        menuId: 'uuid02',
        parent: 1,
        name: 'Home Page 02',
        children: [
          {
            key: 13,
            menuItemId: 'uuid01',
            name: '0-0-1',
            path: '/search-list',
            icon: 'user',
            authority: ['member', 'user'],
            menuId: 'uuid02',
          },
          {
            key: 14,
            menuItemId: 'uuid02',
            name: '0-0-2',
            path: '/question',
            icon: 'global',
            authority: ['gust'],
            menuId: 'uuid02',
          },
        ],
      },
    ],
  },
  'POST /api/menu/add': (req, res) => {
    res.send({ status: 'ok', data: { ...req.body, menuId: '001' } });
  },
  'PUT /api/menu/update': (req, res) => {
    res.send({ status: 'ok', data: req.body });
  },
  'DELETE /api/menu/delete/:menuId': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/menu/search': (req, res) => {
    res.send({ status: 'ok' });
  },
  'POST /api/menu/item/add': (req, res) => {
    res.send({ status: 'ok', data: req.body });
  },
  'PUT /api/menu/item/update': (req, res) => {
    res.send({ status: 'ok', data: {} });
  },
  'GET /api/menu/item/fetch': (req, res) => {
    res.send({
      status: 'ok',
      data: [
        {
          menuItemId: '001',
          name: 'Khám phá',
          icon: 'like',
          path: '/home/newfeed',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '002',
          name: 'Tìm kiếm',
          icon: 'like',
          path: '/search',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '003',
          name: 'Chat',
          icon: 'like',
          path: '/chat',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '004',
          name: 'Khách thăm',
          icon: 'like',
          path: '/visit',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '005',
          name: 'Bạn bè',
          icon: 'like',
          path: '/friends',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '006',
          name: 'Nghe lại VOV',
          icon: 'like',
          path: '/search-list',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
        {
          menuItemId: '007',
          name: 'Thính giả lên VOV',
          icon: 'like',
          path: '/detail-list',
          authority: ['gust', 'member'],
          activeIcon: 'like',
        },
      ],
    });
  },
  'DELETE /api/menu/group/delete/item': (req, res) => {
    console.log(req.params, req.query);
    res.send({ status: 'ok', data: req.query });
  },
};
