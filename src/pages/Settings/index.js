import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Card, List } from 'antd';

/* eslint react/no-multi-comp:0 */
@connect(({ loading, setting }) => ({
  setting,
  loading: loading.models.setting,
}))
class Settings extends PureComponent {
  render() {
    // const { setting } = this.props;
    return <div>Settings</div>;
  }
}
export default Settings;
