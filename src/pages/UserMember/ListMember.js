/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './ListMember.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, loading, members }) => ({
  list,
  getalluser: members.getalluser,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false, dataAllUser: [] };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/getalluser',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { getalluser } = this.props;
    if (getalluser !== nextProps.getalluser) {
      this.setState({
        dataAllUser: nextProps.getalluser,
      });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  // eslint-disable-next-line camelcase
  handClickDeleteUser(user_id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/deleteuser',
      payload: user_id,
    });
  }

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  // eslint-disable-next-line class-methods-use-this
  handleCancleDeleteUser() {}

  // eslint-disable-next-line camelcase
  handleClickActiceUser(e, user_id) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'members/changepublic',
      payload: {
        user_id,
        status: e,
      },
    });
  }

  render() {
    const { loading } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {}, dataAllUser } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="Tìm kiếm"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      pageSize: 5,
      total: dataAllUser.length,
    };

    const ListContent = ({ data: { createat, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Tình trạng</span>
          <p>{status === 'active' ? 'Đang hoạt động' : 'Đang tạm khóa'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Ngày tạo</span>
          <p>{moment(createat).format('DD-MM-YYYY HH:mm')}</p>
        </div>
      </div>
    );

    // eslint-disable-next-line camelcase

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="任务名称" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入任务名称' }],
              initialValue: current.title,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="开始时间" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: '请选择开始时间' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="请选择"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label="任务负责人" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: '请选择任务负责人' }],
              initialValue: current.owner,
            })(
              <Select placeholder="请选择">
                <SelectOption value="付晓晓">付晓晓</SelectOption>
                <SelectOption value="周毛毛">周毛毛</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="产品描述">
            {getFieldDecorator('subDescription', {
              rules: [{ message: '请输入至少五个字符的产品描述！', min: 5 }],
              initialValue: current.subDescription,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={6} xs={24}>
                <Info title="Tổng thành viên" value={dataAllUser.length} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info
                  title="Đang hoạt động"
                  value={dataAllUser.filter(value => value.status === 'active').length}
                  bordered
                />
              </Col>
              <Col sm={6} xs={24}>
                <Info
                  title="Giới tính nam"
                  value={dataAllUser.filter(value => value.gender === 'male').length}
                  bordered
                />
              </Col>
              <Col sm={6} xs={24}>
                <Info
                  title="Giới tính nữ"
                  value={dataAllUser.filter(value => value.gender === 'female').length}
                />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={dataAllUser.sort((a, b) => new Date(b.createat) - new Date(a.createat))}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Bạn có chắc muốn xóa thành viên này?"
                      onConfirm={() => this.handClickDeleteUser(item.user_id)}
                      onCancel={() => this.handleCancleDeleteUser()}
                      okText="Có"
                      cancelText="Không"
                    >
                      <span style={{ cursor: 'pointer', color: '#3498db' }}>Xóa</span>
                    </Popconfirm>,
                    <Select
                      value={item.status}
                      onChange={e => this.handleClickActiceUser(e, item.user_id)}
                    >
                      <SelectOption value="active">Hoạt động</SelectOption>
                      <SelectOption value="lock">Tạm khóa</SelectOption>
                    </Select>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`http://cdn.henhoradio.net/images/ft/${item.avatar}`}
                        shape="square"
                        size="large"
                      />
                    }
                    title={
                      <a href={`/member/detail/question?id=${item.user_id}`}>{item.fullname}</a>
                    }
                    description={
                      <span>
                        {item.address}, {item.age} tuổi, {item.gender === 'male' ? 'Nam' : 'Nữ'}
                      </span>
                    }
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `任务${current.id ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
