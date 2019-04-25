import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  DatePicker,
  Modal,
  message,
  Upload,
  Tooltip,
  Radio,
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
const status = { HN: 'Hà Nội', HCM: 'tp.HCM' };
function beforeUploadAudio(file) {
  const isJPG = file.type === 'audio/mp3';
  if (!isJPG) {
    message.error('You can only upload mp3/waw file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 100;
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
  const normFile = e => {
    try {
      this.setState({
        fileID: e.file.response.file.audioid,
      });
    } catch (ex) {
      console.log(ex);
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

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
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
          {form.getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.title.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Đài">
          {form.getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.title.required' }),
              },
            ],
            initialValue: 'HN',
          })(
            <Select>
              <Option value="HN">Hà Nội</Option>
              <Option value="HCM">Tp.HCM</Option>
            </Select>
          )}
        </FormItem>
        <Form.Item {...formItemLayout} label="Upload">
          {form.getFieldDecorator('upload', {
            getValueFromEvent: normFile,
          })(
            <Upload name="file" action="/upload/audio" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )}
        </Form.Item>
        <FormItem {...formItemLayout} label={<span>Link</span>}>
          {form.getFieldDecorator('link')(<Input placeholder="Link nghe" />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
          {form.getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.date.required' }),
              },
            ],
          })(<DatePicker style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.goal.label" />}>
          {form.getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.goal.required' }),
              },
            ],
          })(
            <TextArea
              style={{ minHeight: 32 }}
              placeholder={formatMessage({ id: 'form.goal.placeholder' })}
              rows={4}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              MC
              <em className={styles.optional}>
                <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                  <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                </Tooltip>
              </em>
            </span>
          }
        >
          {form.getFieldDecorator('mc')(
            <Input placeholder={formatMessage({ id: 'form.client.placeholder' })} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.public.label" />}
          help={<FormattedMessage id="form.public.label.help" />}
        >
          <div>
            {form.getFieldDecorator('public', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="1">
                  <FormattedMessage id="form.public.radio.public" />
                </Radio>
                <Radio value="2">
                  <FormattedMessage id="form.public.radio.partially-public" />
                </Radio>
                <Radio value="3">
                  <FormattedMessage id="form.public.radio.private" />
                </Radio>
              </Radio.Group>
            )}
            <FormItem style={{ marginBottom: 0 }}>
              {form.getFieldDecorator('publicUsers')(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                  style={{
                    margin: '8px 0',
                    display: form.getFieldValue('public') === '2' ? 'block' : 'none',
                  }}
                >
                  <Option value="1">
                    <FormattedMessage id="form.publicUsers.option.A" />
                  </Option>
                  <Option value="2">
                    <FormattedMessage id="form.publicUsers.option.B" />
                  </Option>
                  <Option value="3">
                    <FormattedMessage id="form.publicUsers.option.C" />
                  </Option>
                </Select>
              )}
            </FormItem>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.public" />}>
          <div>{form.getFieldDecorator('youtube', {})(<Checkbox>Youtube</Checkbox>)}</div>
        </FormItem>
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
        ...props.values,
      },
      currentStep: 0,
    };

    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
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
          if (currentStep === 0) {
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
    return [
      <FormItem key="title" {...this.formLayout} label="Tiêu đề">
        {form.getFieldDecorator('title', {
          initialValue: formVals.title,
        })(<Input />)}
      </FormItem>,
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
      <FormItem
        {...this.formItemLayout}
        label={
          <span>
            MC
            <em className="">
              <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {form.getFieldDecorator('mc', {
          initialValue: formVals.mc,
        })(<Input placeholder={formatMessage({ id: 'form.client.placeholder' })} />)}
      </FormItem>,
      <FormItem
        {...this.formItemLayout}
        label={<FormattedMessage id="form.public.label" />}
        help={<FormattedMessage id="form.public.label.help" />}
      >
        <div>
          {form.getFieldDecorator('public', {
            initialValue: formVals.status,
          })(
            <Radio.Group>
              <Radio value="1">
                <FormattedMessage id="form.public.radio.public" />
              </Radio>
              <Radio value="2">
                <FormattedMessage id="form.public.radio.partially-public" />
              </Radio>
              <Radio value="3">
                <FormattedMessage id="form.public.radio.private" />
              </Radio>
            </Radio.Group>
          )}
          <FormItem style={{ marginBottom: 0 }}>
            {form.getFieldDecorator('publicUsers')(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                style={{
                  margin: '8px 0',
                  display: form.getFieldValue('public') === '2' ? 'block' : 'none',
                }}
              >
                <Option value="1">
                  <FormattedMessage id="form.publicUsers.option.A" />
                </Option>
                <Option value="2">
                  <FormattedMessage id="form.publicUsers.option.B" />
                </Option>
                <Option value="3">
                  <FormattedMessage id="form.publicUsers.option.C" />
                </Option>
              </Select>
            )}
          </FormItem>
        </div>
      </FormItem>,
      <FormItem key="audio" {...this.formLayout} label="File ghi âm">
        <div className="dropbox">
          {form.getFieldDecorator('audio', {
            initialValue: formVals.audio,
          })(
            <Upload.Dragger name="file" action="/upload/audio" beforeUpload={beforeUploadAudio}>
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
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Huỷ
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
        Lưu lại
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
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ track, loading, members }) => ({
  track,
  members,
  loading: loading.models.track,
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
    playerModalVisible: false,
    playerSelected: {},
  };

  columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
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
      dataIndex: 'date',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Ghi âm',
      dataIndex: 'audioRecord',
      filters: [
        {
          text: 'Có',
          value: 2,
        },
        {
          text: 'Không',
          value: 1,
        },
      ],
      onFilter: (value, record) => record.audioRecord === parseInt(value, 10),
      render: (val, record) => {
        if (val === 1) {
          return <div />;
        }
        if (val === 1) {
          return (
            <Icon
              type="play-circle"
              onClick={() => this.handlePlayerModalVisible(true, record)}
              theme="filled"
            />
          );
        }
        return <div />;
      },
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Fragment>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.editAndDelete(key, record)}>
                <Menu.Item key="edit">Edit</Menu.Item>
                <Menu.Item key="publish">Publish</Menu.Item>
                <Menu.Item key="delete">Delete</Menu.Item>
              </Menu>
            }
          >
            <a>
              Thêm <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'track/fetch',
    });
  }

  handlePlayerModalVisible = (flag, record) => {
    this.setState({
      playerModalVisible: !!flag,
      playerSelected: record,
    });
  };

  editAndDelete = (key, currentItem) => {
    if (key === 'edit') this.handleUpdateModalVisible(true, currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: 'Xác nhận xoá',
        content: 'Bạn chắc chắn muốn xoá？',
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => this.deleteItem(currentItem.membersid),
      });
    }
  };

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
      type: 'track/fetch',
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
      type: 'track/fetch',
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
          type: 'track/remove',
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
      const values = {
        ...fieldsValue,
        timeup: fieldsValue.timeup ? fieldsValue.timeup.format('DD-MM-YYYY') : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'track/fetch',
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
      type: 'track/add',
      payload: fields,
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'track/update',
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} />
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Thời gian">
              {getFieldDecorator('timeup')(
                <DatePicker style={{ width: '100%' }} placeholder="lên sóng" />
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
      track: { table },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      playerModalVisible,
      playerSelected,
    } = this.state;
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
    const footerPlayerModel = (
      <Button
        key="forward"
        type="primary"
        onClick={() => this.handlePlayerModalVisible(false, playerSelected)}
      >
        Close
      </Button>
    );
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
              scroll={{ x: 1300 }}
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
        <Modal
          width={740}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={playerSelected ? playerSelected.name : null}
          visible={playerModalVisible}
          footer={footerPlayerModel}
          onOk={() => this.handlePlayerModalVisible(false, playerSelected)}
          afterClose={() => this.handlePlayerModalVisible()}
        >
          <ReactPlayer url={playerSelected.source} playing />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
