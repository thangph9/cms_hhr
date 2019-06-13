import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Divider } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

@connect(({ members }) => ({
  getmemberbyid: members.getmemberbyid,
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputValue: '',
    dataMember: {},
    loadingPage: true,
  };

  componentWillReceiveProps(nextProps) {
    const { getmemberbyid } = this.props;

    if (getmemberbyid !== nextProps.getmemberbyid) {
      this.setState({
        dataMember: nextProps.getmemberbyid.result,
        loadingPage: false,
      });
    }
  }

  onTabChange = key => {
    const { match, location } = this.props;
    const { id } = location.query;
    switch (key) {
      case 'question':
        router.push(`${match.url}/question?id=${id}`);
        break;
      case 'changeinfo':
        router.push(`${match.url}/changeinfo?id=${id}`);
        break;
      case 'changepass':
        router.push(`${match.url}/changepass?id=${id}`);
        break;
      default:
        break;
    }
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputValue: '',
    });
  };

  render() {
    const { dataMember, loadingPage } = this.state;
    const { listLoading, currentUserLoading, match, location, children } = this.props;

    const operationTabList = [
      {
        key: 'question',
        tab: <span>Câu hỏi và trả lời</span>,
      },
      {
        key: 'changeinfo',
        tab: <span>Thay đổi thông tin</span>,
      },
      {
        key: 'changepass',
        tab: <span>Cài đặt bảo mật</span>,
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {!loadingPage && (
                <div>
                  <div className={styles.avatarHolder}>
                    <div
                      className={styles['image-avatar']}
                      style={{
                        backgroundImage: `url(http://cdn.henhoradio.net/images/ft/${
                          dataMember.avatar
                        })`,
                      }}
                    />
                    <div className={styles.name}>{dataMember.fullname}</div>
                    <div>
                      {dataMember.gender === 'male' ? 'Nam' : 'Nữ'},{' '}
                      {new Date().getFullYear() - dataMember.dob_year} tuổi
                    </div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      Công việc: {dataMember.jobs ? dataMember.jobs.jobs : 'Chưa hoàn thiện'}
                    </p>
                    <p>
                      <i className={styles.group} />
                      Trình độ:{' '}
                      {dataMember.education ? dataMember.education.education : 'Chưa hoàn thiện'}
                    </p>
                    <p>
                      <i className={styles.address} />
                      {dataMember.address}
                    </p>
                  </div>
                  <Divider dashed />
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
