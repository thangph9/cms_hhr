import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Upload,
  Divider,
  Steps,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
const status = { HN: 'Hà Nội', HCM: 'tp.HCM' };
function beforeUploadAudio(file) {
  const isJPG = file.type === 'audio/mpeg';
  if (!isJPG) {
    message.error('You can only upload mp3/waw file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('Image must smaller than 10MB!');
  }
  return isJPG && isLt2M;
}
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const prefixSelector = form.getFieldDecorator('prefix', {
    initialValue: '84',
  })(
    <Select style={{ width: 70 }}>
      <Option value="84">+84</Option>
    </Select>
  );
  return (
    <Modal
      destroyOnClose
      width={768}
      title="Thêm mới"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row>
        <Col md={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Mã số">
            {form.getFieldDecorator('ucode', {
              rules: [{ required: true, message: 'Yêu cầu nhập mã số！' }],
            })(<InputNumber placeholder="Mã số ON" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Họ & Tên">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: 'Yêu cầu nhập họ tên！', min: 5 }],
            })(<Input placeholder="Nhập họ tên " />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="SĐT ">
            {form.getFieldDecorator('mobile', {
              rules: [{ required: true, message: 'Nhập SDT!' }],
            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Giới tính">
            {form.getFieldDecorator('gender', {})(
              <Select style={{ width: '100%' }}>
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Năm">
            {form.getFieldDecorator('year')(<Input width="100%" placeholder="" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Công việc">
            {form.getFieldDecorator('job')(<Input placeholder="" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Địa chỉ">
            {form.getFieldDecorator('address')(<Input placeholder="" />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Thời gian ">
            {form.getFieldDecorator('timeup')(
              <DatePicker style={{ width: '100%' }} placeholder="lên sóng" />
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Khu vực ">
            {form.getFieldDecorator('location')(
              <Select placeholder="Khu vực" style={{ width: '100%' }}>
                <Option value="HN">Hà Nôi</Option>
                <Option value="HCM">tp.HCM</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Tình trạng">
            {form.getFieldDecorator('relationship')(
              <Select placeholder="Lựa chọn" style={{ width: '100%' }}>
                <Option value="SINGLE">Độc thân</Option>
                <Option value="DIVORCE">Đã kết hôn</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Ghi âm">
            <div className="dropbox">
              {form.getFieldDecorator('audio', {
                valuePropName: 'fileList',
              })(
                <Upload.Dragger name="files" action="/upload.do" beforeUpload={beforeUploadAudio}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Upload file ghi âm của thính giả lên sóng</p>
                  <p className="ant-upload-hint">Hỗ trợ kéo thả file </p>
                </Upload.Dragger>
              )}
            </div>
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
        ...props.values,
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="location" {...this.formLayout} label="Khu vực">
          {form.getFieldDecorator('location', {
            initialValue: formVals.location,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="HN">Hà nội</Option>
              <Option value="HCM">tp.HCM</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="timeup" {...this.formLayout} label="Thời gian">
          {form.getFieldDecorator('timeup', {
            rules: [{ required: true, message: 'Chọn thời gian lên sóng！' }],
            initialValue: moment(formVals.timeup),
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Thời gian"
            />
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="audio" {...this.formLayout} label="File ghi âm">
          <div className="dropbox">
            {form.getFieldDecorator('audio', {
              valuePropName: 'fileList',
            })(
              <Upload.Dragger name="files" action="/upload.do" beforeUpload={beforeUploadAudio}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Upload file ghi âm của thính giả lên sóng</p>
                <p className="ant-upload-hint">Hỗ trợ kéo thả file </p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>,
      ];
    }
    return [
      <FormItem key="ucode" {...this.formLayout} label="Mã số">
        {form.getFieldDecorator('ucode', {
          initialValue: formVals.ucode,
        })(<Input rows={4} placeholder="Nhập mã số" />)}
      </FormItem>,
      <FormItem key="name" {...this.formLayout} label="Họ & Tên">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Yêu cầu nhập họ tên！' }],
          initialValue: formVals.name,
        })(<Input placeholder="Họ & Tên" />)}
      </FormItem>,

      <FormItem key="mobile" {...this.formLayout} label="SĐT">
        {form.getFieldDecorator('mobile', {
          initialValue: formVals.mobile,
        })(<Input rows={4} placeholder="Nhập số điện thoại" />)}
      </FormItem>,
      <FormItem key="year" {...this.formLayout} label="Năm sinh">
        {form.getFieldDecorator('year', {
          initialValue: formVals.year,
        })(<Input />)}
      </FormItem>,
      <FormItem key="gender" {...this.formLayout} label="Giới tính">
        {form.getFieldDecorator('gender', {
          initialValue: formVals.gender,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="MALE">Nam</Option>
            <Option value="FEMALE">Nữ</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="relationship" {...this.formLayout} label="Tình trạng">
        {form.getFieldDecorator('relationship', {
          initialValue: formVals.relationship,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="SINGLE">Độc thân</Option>
            <Option value="DIVORCE">Đã kết hôn </Option>
          </Select>
        )}
      </FormItem>,

      <FormItem key="address" {...this.formLayout} label="Địa chỉ">
        {form.getFieldDecorator('address', {
          initialValue: formVals.address,
        })(<TextArea rows={4} placeholder="Nhập địa chỉ" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          Quay lại
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          Huỷ
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          Tiếp tục
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          Quay lại
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          Lưu lại
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Huỷ
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        Tiếp tục
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Thay đổi thông tin"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="Cơ bản" />
          <Step title="Khu vực" />
          <Step title="Audio" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading, members }) => ({
  rule,
  members,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: 'Mã số',
      children: [
        {
          title: 'On',
          dataIndex: 'ucode',
          key: 'ucode',
        },
        {
          title: 'Off',
          dataIndex: 'gcode',
          key: 'gcode',
        },
      ],
    },
    {
      title: 'Họ & Tên',
      dataIndex: 'name',
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'mobile',
    },
    {
      title: 'Khu vực',
      dataIndex: 'location',
      filters: [
        {
          text: status.HN,
          value: 'HN',
        },
        {
          text: status.HCM,
          value: 'HCM',
        },
      ],
      onFilter: (value, record) => record.location === value,
      render: val => <span>{status[val]}</span>,
    },
    {
      title: 'Ngày lên sóng',
      dataIndex: 'timeup',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>Edit</a>
          <Divider type="vertical" />
          <a href="">More</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    dispatch({
      type: 'members/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        timeup: fieldsValue.timeup.toString(),
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'members/search',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/add',
      payload: fields,
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'members/update',
      payload: {
        ...fields,
        ...formValues,
      },
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Thời gian">
              {getFieldDecorator('timeup')(
                <DatePicker style={{ width: '100%' }} placeholder="lên sóng" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Khu vực">
              {getFieldDecorator('location')(
                <Select placeholder="Khu vực" style={{ width: '100%' }}>
                  <Option value="HN">Hà Nôi</Option>
                  <Option value="HCM">tp.HCM</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Đặt lại
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Nâng cao <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Mã số">
              {getFieldDecorator('code')(<Input placeholder="Mã số" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Khu vực">
              {getFieldDecorator('location')(
                <Select placeholder="Chọn Khu vực" style={{ width: '100%' }}>
                  <Option value="HN">Hà Nội</Option>
                  <Option value="HCM">tp.HCM</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Số điện thoại">
              {getFieldDecorator('mobile')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Thời gian">
              {getFieldDecorator('timeup')(
                <DatePicker style={{ width: '100%' }} placeholder="lên sóng" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Nghê nghiệp">
              {getFieldDecorator('job')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Tình trạng">
              {getFieldDecorator('relationship')(
                <Select placeholder="Lựa chọn" style={{ width: '100%' }}>
                  <Option value="SINGLE">Độc thân</Option>
                  <Option value="DIVORCE">Đã kết hôn</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Tạo lại
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Cơ bản <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      members: { table },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="Danh sách">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                Thêm mới
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={table}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
