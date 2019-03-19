import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';
import LazyImage from './LazyImage';

/* eslint react/no-multi-comp:0 */
@connect(({ loading, lazy }) => ({
  lazy,
  loading: loading.models.lazy,
}))
class ListImage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lazy/fetch',
    });
  }

  render() {
    const {
      lazy: { list },
    } = this.props;
    return (
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card>
              <LazyImage
                src={item}
                placeHolder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC"
              />
            </Card>
          </List.Item>
        )}
      />
    );
  }
}
export default ListImage;
