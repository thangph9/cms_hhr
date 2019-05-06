import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import ReactPlayer from 'react-player';
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
  Modal,
  Radio,
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
const typeOption = ['', 'Nhập', 'Lựa chon', 'Checkbox'];
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form: { getFieldDecorator, getFieldValue },
    form,
    handleAdd,
    handleModalVisible,
    group: { table },
    handleDeleteAnswer,
    handleEditAnswer,
    handleChangeOptions,
    handleAnswerBlur,
    question,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
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
  const ListAnswer = values => {
    let group = '';
    const {
      list: { questionType, listAnswer },
    } = values;
    if (questionType === '2') {
      const list = [];
      values.list.listAnswer.forEach((e, i) => {
        list[i] = (
          <Row key={e}>
            <Col xs={18}>
              <Radio value={e}>{e}</Radio>
            </Col>
            <Col xs={6} style={{ textAlign: 'right' }}>
              <Button size="small" onClick={() => handleEditAnswer(i)}>
                <Icon type="edit" />
              </Button>
              <Button size="small" onClick={() => handleDeleteAnswer(e)}>
                <Icon type="delete" />
              </Button>
            </Col>
          </Row>
        );
      });
      group = <Radio.Group style={{ width: '100%' }}>{list}</Radio.Group>;
    } else if (questionType === '3') {
      const list = [];
      listAnswer.forEach((e, i) => {
        list[i] = (
          <Row key={e}>
            <Col span={18}>
              <Checkbox value={e}>{e}</Checkbox>
            </Col>
            <Col xs={6} style={{ textAlign: 'right' }}>
              <Button size="small" onClick={() => handleEditAnswer(i)}>
                <Icon type="edit" />
              </Button>
              <Button size="small" onClick={() => handleDeleteAnswer(e)}>
                <Icon type="delete" />
              </Button>
            </Col>
          </Row>
        );
      });
      group = <CheckboxGroup style={{ width: '100%' }}>{list}</CheckboxGroup>;
    }
    return <Row>{group}</Row>;
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
        <Col md={24}>
          <FormItem {...formItemLayout} label="Tiêu đề">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Nhóm">
            {getFieldDecorator('group_id', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn group',
                },
              ],
            })(
              <Select placeholder="Lựa chọn nhóm group" style={{ width: 400 }}>
                {table.list.map(v => (
                  <Option key={v.group_id} value={v.group_id}>
                    {v.title}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            <div>
              {getFieldDecorator('options', {
                initialValue: '1',
                onChange: handleChangeOptions,
              })(
                <Radio.Group>
                  <Radio value="1">Nhập</Radio>
                  <Radio value="2">Lựa chọn</Radio>
                  <Radio value="3">Checkbox</Radio>
                </Radio.Group>
              )}
              <FormItem {...formItemLayout}>
                {getFieldDecorator('listAnswer', {
                  initialValue: question.listAnswer,
                })(<Input type="hidden" />)}
              </FormItem>
              <ListAnswer list={question} />
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator('answer')(
                  <Input
                    onBlur={handleAnswerBlur}
                    style={{
                      margin: '8px 0',
                      display: getFieldValue('options') !== '1' ? 'block' : 'none',
                    }}
                  />
                )}
              </FormItem>
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator('addAnswer')(
                  <Button
                    type="primary"
                    style={{
                      margin: '8px 0',
                      display: getFieldValue('options') !== '1' ? 'block' : 'none',
                    }}
                  >
                    Thêm
                  </Button>
                )}
              </FormItem>
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
          console.log(currentStep);
          handleUpdate(formVals);
        }
      );
    });
  };

  renderContent = (currentStep, formVals) => {
    const {
      form: { getFieldDecorator, getFieldValue },
      form,
      group: { table },
      handleDeleteAnswer,
      handleEditAnswer,
      handleChangeOptions,
      handleAnswerBlur,
      question,
    } = this.props;
    const ListAnswer = props => {
      let group = '';
      if (props.list.questionType === '2') {
        const list = [];
        props.list.listAnswer.forEach((e, i) => {
          list[i] = (
            <Row key={e}>
              <Col xs={18}>
                <Radio value={e}>{e}</Radio>
              </Col>
              <Col xs={6} style={{ textAlign: 'right' }}>
                <Button size="small" onClick={() => handleEditAnswer(i)}>
                  <Icon type="edit" />
                </Button>
                <Button size="small" onClick={() => handleDeleteAnswer(e)}>
                  <Icon type="delete" />
                </Button>
              </Col>
            </Row>
          );
        });
        group = <Radio.Group style={{ width: '100%' }}>{list}</Radio.Group>;
      } else if (props.list.questionType === '3') {
        const list = [];
        props.list.listAnswer.forEach((e, i) => {
          list[i] = (
            <Row key={e}>
              <Col span={18}>
                <Checkbox value={e}>{e}</Checkbox>
              </Col>
              <Col xs={6} style={{ textAlign: 'right' }}>
                <Button size="small" onClick={() => handleEditAnswer(i)}>
                  <Icon type="edit" />
                </Button>
                <Button size="small" onClick={() => handleDeleteAnswer(e)}>
                  <Icon type="delete" />
                </Button>
              </Col>
            </Row>
          );
        });
        group = <CheckboxGroup style={{ width: '100%' }}>{list}</CheckboxGroup>;
      }
      return <Row>{group}</Row>;
    };
    return [
      <FormItem key="title" {...this.formLayout} label="Câu hỏi">
        {form.getFieldDecorator('title', {
          initialValue: formVals.title,
        })(<Input />)}
      </FormItem>,
      <FormItem key="group" {...this.formLayout} label="Nhóm">
        {getFieldDecorator('group_id', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn group',
            },
          ],
          initialValue: formVals.group_id,
        })(
          <Select placeholder="Lựa chọn nhóm group" style={{ width: 400 }}>
            {table.list.map(v => (
              <Option key={v.group_id} value={v.group_id}>
                {v.title}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="options" {...this.formLayout}>
        <div>
          {getFieldDecorator('options', {
            initialValue: formVals.type,
            onChange: handleChangeOptions,
          })(
            <Radio.Group>
              <Radio value="1">Nhập</Radio>
              <Radio value="2">Lựa chọn</Radio>
              <Radio value="3">Checkbox</Radio>
            </Radio.Group>
          )}
          <FormItem {...this.formLayout}>
            {getFieldDecorator('listAnswer', {
              initialValue: question.listAnswer,
            })(<Input type="hidden" />)}
          </FormItem>
          <ListAnswer list={question} />
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator('answer')(
              <Input
                onBlur={handleAnswerBlur}
                style={{
                  margin: '8px 0',
                  display: getFieldValue('options') !== '1' ? 'block' : 'none',
                }}
              />
            )}
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator('addAnswer')(
              <Button
                type="primary"
                style={{
                  margin: '8px 0',
                  display: getFieldValue('options') !== '1' ? 'block' : 'none',
                }}
              >
                Thêm
              </Button>
            )}
          </FormItem>
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
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ group, loading, question }) => ({
  group,
  question,
  loading: loading.models.question,
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
    question: {
      listAnswer: [],
      questionType: 1,
    },
    stateStatus: 'add',
    playerSelected: {},
  };

  columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'title',
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
    },
    {
      title: 'Đáp án',
      dataIndex: 'answer',
      render: (text, record) => {
        const listAns = [];
        if (Array.isArray(record.answer)) {
          record.answer.forEach((e, i) => {
            listAns[i] = (
              <div key={e}>
                <span>{e}</span>
                <br />
              </div>
            );
          });
        }
        return <Fragment>{listAns}</Fragment>;
      },
    },
    {
      title: 'Kiểu',
      dataIndex: 'type',
      render: (text, record) => (
        <Fragment>
          <span>{typeOption[Number(record.type)]}</span>
        </Fragment>
      ),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Fragment>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.editAndDelete(key, record)}>
                <Menu.Item key="edit">Edit</Menu.Item>
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
      type: 'question/fetch',
    });
    dispatch({
      type: 'group/fetch',
    });
  }

  handleAnswerBlur = e => {
    const value = e.target;
    const {
      question: { listAnswer, questionType },
      index,
      stateStatus,
    } = this.state;
    if (value.value !== '') {
      if (stateStatus === 'add') {
        this.setState({
          question: { listAnswer: [...listAnswer, value.value], questionType },
        });
      } else if (stateStatus === 'edit') {
        listAnswer[index] = value.value;
        this.setState({
          question: { listAnswer: [...listAnswer], questionType },
          stateStatus: 'add',
        });
      }
    }
  };

  handleChangeOptions = e => {
    const value = e.target;
    const { stateStatus } = this.state;
    this.setState({
      question: { listAnswer: [], questionType: value.value },
      stateStatus,
    });
  };

  handleDeleteAnswer = value => {
    const {
      question: { listAnswer, questionType },
    } = this.state;
    const newList = listAnswer.filter(e => e !== value);
    this.setState({
      question: { listAnswer: [...newList], questionType },
    });
  };

  handleEditAnswer = value => {
    const {
      question: { listAnswer },
    } = this.state;
    const { form } = this.props;
    form.setFieldsValue({ answer: listAnswer[value] });
    this.setState({
      stateStatus: 'edit',
      index: value,
    });
  };

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
        onOk: () => this.deleteItem(currentItem),
      });
    }
  };

  deleteItem = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/remove',
      payload: params,
    });
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
      type: 'question/fetch',
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
      type: 'question/fetch',
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
      const values = {
        ...fieldsValue,
        timeup: fieldsValue.timeup ? fieldsValue.timeup.format('DD-MM-YYYY') : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'question/fetch',
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
      question: {
        listAnswer: record ? record.answer : [],
        questionType: record ? record.type : 1,
      },
    });
  };

  handleAdd = fields => {
    const { dispatch, group } = this.props;
    dispatch({
      type: 'question/save',
      payload: {
        data: { ...fields, action: 'add' },
        group: group.table,
      },
    });
    this.setState({
      question: {
        listAnswer: [],
        questionType: 1,
      },
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch, group } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'question/save',
      payload: {
        data: {
          ...fields,
          ...formValues,
          action: 'update',
        },
        group: group.table,
      },
    });

    this.setState({
      question: {
        listAnswer: [],
        questionType: 1,
      },
    });
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      question: { table },
      group,
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
      group,
      question: this.state.question, // eslint-disable-line
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleDeleteAnswer: this.handleDeleteAnswer,
      handleEditAnswer: this.handleEditAnswer,
      handleChangeOptions: this.handleChangeOptions,
      handleAnswerBlur: this.handleAnswerBlur,
    };
    const updateMethods = {
      group,
      question: this.state.question, // eslint-disable-line
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleDeleteAnswer: this.handleDeleteAnswer,
      handleEditAnswer: this.handleEditAnswer,
      handleChangeOptions: this.handleChangeOptions,
      handleAnswerBlur: this.handleAnswerBlur,
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
