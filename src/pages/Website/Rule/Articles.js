import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, List, Icon, Button } from 'antd';

import ArticleListContent from '@/components/ArticleListContent';
import styles from './Articles.less';

const pageSize = 5;

@connect(({ list, loading, rule }) => ({
  list,
  loading: loading.models.rule,
  rule,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'rule/fetch',
      payload: {
        count: 5,
      },
    });
  },
})
class SearchList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        count: 5,
      },
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;

    const { list } = data;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <Fragment>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText type="star-o" text={item.star} />,
                  <IconText type="like-o" text={item.like} />,
                  <IconText type="message" text={item.message} />,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.name}
                    </a>
                  }
                  description={<span>{item.description}</span>}
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </Fragment>
    );
  }
}

export default SearchList;
