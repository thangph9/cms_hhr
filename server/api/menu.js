const async = require('async'); // eslint-disable-line
const express = require('express'); // eslint-disable-line
const models = require('../settings');

const Uuid = models.datatypes.Uuid; // eslint-disable-line

const router = express.Router();

function add(req, res) {
  const PARAM_IS_VALID = {};
  PARAM_IS_VALID.menuId = Uuid.random();
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.createat = new Date();
          PARAM_IS_VALID.parent = 1;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addMenu(callback) {
        const menuObject = {
          menuid: PARAM_IS_VALID.menuId,
          name: PARAM_IS_VALID.name,
          createat: PARAM_IS_VALID.createat,
        };
        const instance = new models.instance.menu(menuObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function fetchMenu(req, res) {
  async.series(
    [
      function initialValue(callback) {
        callback(null, null);
      },
      function fetchMenuBase(callback) {
        models.instance.menu.find({}, (err, item) => {
          callback(err, item);
        });
      },
      function fetchMenuGroup(callback) {
        models.instance.menuGroup.find({}, (err, item) => {
          callback(err, item);
        });
      },
      function fetchMenuItemBase(callback) {
        models.instance.menuItem.find({}, (err, item) => {
          callback(err, item);
        });
      },
    ],
    (err, result) => {
      let response = {};

      if (err) response = { status: 'error' };
      // console.log(result);
      else {
        const treeMap = [];
        if (Array.isArray(result[1])) {
          result[1].forEach((l, j) => {
            let e = l;
            const tmp = JSON.stringify(e);
            e = JSON.parse(tmp);
            e.parent = 1;
            e.menuId = e.menuid;
            if (Array.isArray(result[2])) {
              const children = result[2].filter(k => k.menuid.toString() === e.menuId.toString());
              if (children.length > 0) {
                children.forEach((t, i) => {
                  const temp = JSON.stringify(
                    result[3].filter(f => t.menuitemid.toString() === f.menuitemid.toString())[0]
                  );

                  const item = JSON.parse(temp);
                  item.menuId = e.menuId;
                  item.menuItemId = t.menuitemid;
                  children[i] = item;
                });
                e.children = children;
              }

              /* result[2].filter((k,i)=>{
                           if(k.menuid.toString()===e.menuId.toString()){

                               const fil=result[3].filter(t=> t.menuitemid.toString()===k.menuitemid.toString());
                               if(Array.isArray(fil) && fil[0]){
                                   e.children[i]=fil[0];
                               }

                           }else{

                           }
                       })
                       */
            }
            treeMap[j] = e;
          });
        }
        response = { status: 'ok', data: treeMap };
      }
      // console.log(err,response);
      res.send(response);
    }
  );
}
function fetchMenuItem(req, res) {
  async.series(
    [
      function initialValue(callback) {
        callback(null, null);
      },
      function fetchMenuItemBase(callback) {
        models.instance.menuItem.find({}, (err, item) => {
          callback(err, item);
        });
      },
    ],
    (err, result) => {
      let response = {};
      const data = [];
      if (err) {
        response = { status: 'error' };
      } else {
        if (Array.isArray(result[1])) {
          result[1].forEach((f, i) => {
            let e = f;
            const tmp = JSON.stringify(e);
            e = JSON.parse(tmp);
            e.menuItemId = e.menuitemid;
            data[i] = e;
          });
        }
        response = { status: 'ok', data };
      }
      res.send(response);
    }
  );
}
function addItem(req, res) {
  const PARAM_IS_VALID = {};

  PARAM_IS_VALID.menuItemId = Uuid.random();
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.path = params.path;
          PARAM_IS_VALID.icon = params.icon;
          PARAM_IS_VALID.activeIcon = params.activeIcon;
          PARAM_IS_VALID.authority = params.authority;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addMenuItem(callback) {
        const menuItemObject = {
          menuitemid: PARAM_IS_VALID.menuItemId,
          name: PARAM_IS_VALID.name,
          path: PARAM_IS_VALID.path,
          icon: PARAM_IS_VALID.icon,
          activeicon: PARAM_IS_VALID.activeIcon,
          authority: PARAM_IS_VALID.authority,
        };
        const instance = new models.instance.menuItem(menuItemObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: PARAM_IS_VALID });
    }
  );
}
function updateItem(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.menuItemId = models.uuidFromString(params.menuitemid);
          PARAM_IS_VALID.name = params.name;
          PARAM_IS_VALID.icon = params.icon;
          PARAM_IS_VALID.authority = params.authority;
          PARAM_IS_VALID.path = params.path;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function updateMenuItem(callback) {
        const menuItemObject = {
          name: PARAM_IS_VALID.name,
          icon: PARAM_IS_VALID.icon,
          authority: PARAM_IS_VALID.authority,
          path: PARAM_IS_VALID.path,
        };
        const queryObject = { menuitemid: PARAM_IS_VALID.menuItemId };
        const options = { if_exists: true };
        models.instance.menuItem.update(queryObject, menuItemObject, options, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: params });
    }
  );
}
function updateMenu(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.body;

  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.menuItemId = models.uuidFromString(params.menuItemId);
          PARAM_IS_VALID.menuId = models.uuidFromString(params.menuId);
          PARAM_IS_VALID.orderby = params.orderby;
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function addMenuGroup(callback) {
        const menuGroupObject = {
          menuitemid: PARAM_IS_VALID.menuItemId,
          menuid: PARAM_IS_VALID.menuId,
          orderby: PARAM_IS_VALID.orderby || 1,
        };
        const instance = new models.instance.menuGroup(menuGroupObject); // eslint-disable-line
        instance.save(err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: params });
    }
  );
}
function groupDelMenuItem(req, res) {
  const PARAM_IS_VALID = {};
  const params = req.query;
  async.series(
    [
      function initParams(callback) {
        try {
          PARAM_IS_VALID.menuItemId = models.uuidFromString(params.menuitemid);
          PARAM_IS_VALID.menuId = models.uuidFromString(params.menuid);
        } catch (e) {
          console.log(e);
        }
        callback(null, null);
      },
      function groupDelMenuItemBase(callback) {
        const queryObject = {
          menuid: PARAM_IS_VALID.menuId,
          menuitemid: PARAM_IS_VALID.menuItemId,
        };
        models.instance.menuGroup.delete(queryObject, err => {
          callback(err);
        });
      },
    ],
    err => {
      if (err) res.send({ status: 'error' });
      else res.json({ status: 'ok', data: params });
    }
  );
}

router.post('/add', add);
router.get('/fetch', fetchMenu);
router.put('/update', updateMenu);
router.get('/item/fetch', fetchMenuItem);
router.post('/item/add', addItem);
router.put('/item/update', updateItem);
router.delete('/group/delete/item', groupDelMenuItem);
module.exports = router;
