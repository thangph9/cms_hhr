import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Avatar, Divider, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ loading, user, project }) => ({
  user,
  listLoading: loading.effects['list/fetch'],
  member: user.member,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'user/fetchBy',
      payload: match.params.user_id,
    });
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 3,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    //  this.setState({ inputVisible: true }, () => this.input.focus());
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
      // inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const {
      listLoading,
      member,
      currentUserLoading,
      project: { notice },
      projectLoading,
      match,
      location,
      children,
    } = this.props;
    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'applications',
        tab: (
          <span>
            应用 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {member && Object.keys(member).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={member.avatar} />
                    <div className={styles.fullname}>{member.fullname}</div>
                    <div>{member.signature}</div>
                  </div>
                  <div className={styles.description}>
                    <p>
                      <i className={styles.title} />
                      {member.title}
                    </p>
                    <p>
                      <i className={styles.group} />
                      {member.group}
                    </p>
                    <p>
                      <i className={styles.address} />
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>团队</div>
                    <Spin spinning={projectLoading}>
                      <Row gutter={36}>
                        {notice.map(item => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </Spin>
                  </div>
                </div>
              ) : (
                'loading...'
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
