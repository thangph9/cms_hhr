import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Card, Button, Icon, List, Modal, Dropdown, Menu } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './CardList.less';

@connect(({ loading, track }) => ({
  track,
  loading: loading.models.track,
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'track/fetch',
      payload: {
        count: 8,
      },
    });
  }

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'track/delete',
      payload: { id },
    });
  };

  render() {
    const {
      track: { list },
      loading,
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      total: list.length,
    };
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const editAndDelete = (key, currentItem) => {
      if (key === 'public') alert('Update Public');
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Xác nhận',
          content: 'Bạn muốn xoá nội dung？',
          okText: 'Ok',
          cancelText: 'Cancel',
          onOk: () => this.deleteItem(currentItem.track_id),
        });
      }
    };
    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="public">Public</Menu.Item>
            <Menu.Item key="edit">
              <Link to={`/upload/edit/${props.current.track_id}`}>Sửa</Link>
            </Menu.Item>
            <Menu.Item key="delete">Xoá</Menu.Item>
          </Menu>
        }
      >
        <a>
          Lựa chọn <Icon type="down" />
        </a>
      </Dropdown>
    );
    return (
      <PageHeaderWrapper title="卡片列表" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.track_id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Link to={`/upload/detail/${item.track_id}`}>Chi tiết</Link>,
                      <MoreBtn current={item} />,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<Link to={`/upload/edit/${item.track_id}`}>{item.title}</Link>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          MC: {item.mc}
                          <br />
                          Đài: {item.local}
                          <br />
                          Ngày: {moment(item.date).format('DD/MM/YYYY')}
                          <br />
                          {item.local}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> Upload
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
