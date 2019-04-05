import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Card, List } from 'antd';

/* eslint react/no-multi-comp:0 */
@connect(({ loading, menu }) => ({
  menu,
  loading: loading.models.menu,
}))
class Menu extends PureComponent {
  render() {
    // const { menu } = this.props;
    return <div>Menu</div>;
  }
}
export default Menu;
