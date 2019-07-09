import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  Divider,
  InputNumber,
} from 'antd';
import { Link } from 'react-router-dom';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Thêm mới"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Tên">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Yêu cầu nhập tên lớn hơn 5 ký tự！', min: 5 }],
        })(<Input />)}
      </FormItem>
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
      formVals: { ...props.values },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const {
      form,
      handleUpdate,
      table: { list },
    } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const formVals = {
        ...oldValue,
        ...fieldsValue,
        menuItem: list.filter(e => e.menuItemId === fieldsValue.menuItemId)[0],
      };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        }
      );
    });
  };

  renderContent = formVals => {
    const {
      form,
      table: { list },
    } = this.props;
    const options = [];
    list.forEach((e, i) => {
      options[i] = (
        <Option key={e.id} value={e.id}>
          {e.name}
        </Option>
      );
    });
    if (list.length === 0)
      return (
        <div>
          {' '}
          Không tìm thấy menu item <Link to="/online/menu/item/add">Thêm mới</Link>{' '}
        </div>
      );
    return [
      <FormItem key="name" {...this.formLayout} label="Tên">
        {form.getFieldDecorator('name', {
          initialValue: formVals.name,
        })(<Input disabled />)}
      </FormItem>,
      <FormItem key="menuItem" {...this.formLayout} label="Item">
        {form.getFieldDecorator('id', {
          initialValue: list[0].id,
        })(<Select style={{ width: '100%' }}>{options}</Select>)}
      </FormItem>,
      <FormItem key="orderby" {...this.formLayout} label="Vị trí ">
        {form.getFieldDecorator('orderby', {
          initialValue: formVals.orderby,
        })(<InputNumber />)}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext()}>
        Save
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Thêm Item"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

@Form.create()
class UpdateItemForm extends PureComponent {
  static defaultProps = {
    handleUpdateItem: () => {},
    handleUpdateItemModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: { ...props.values },
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleUpdateItem } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdateItem(formVals);
        }
      );
    });
  };

  renderContent = formVals => {
    const { form, rule } = this.props;
    const {
      data: { list },
    } = rule;
    const options = [];
    list.forEach((e, i) => {
      options[i] = (
        <Option key={e.name} value={e.name}>
          {e.name}
        </Option>
      );
    });

    return [
      <FormItem key="name" {...this.formLayout} label="Tên">
        {form.getFieldDecorator('name', {
          initialValue: formVals.name,
        })(<Input />)}
      </FormItem>,
      <FormItem key="path" {...this.formLayout} label="Path">
        {form.getFieldDecorator('path', {
          initialValue: formVals.path,
        })(<Input />)}
      </FormItem>,
      <FormItem key="orderby" {...this.formLayout} label="Vị trí">
        {form.getFieldDecorator('orderby', {
          initialValue: formVals.orderby,
        })(<Input />)}
      </FormItem>,
      <FormItem key="icon" {...this.formLayout} label="Icon">
        {form.getFieldDecorator('icon', {
          initialValue: formVals.icon,
        })(<Input />)}
      </FormItem>,
      <FormItem key="authority" {...this.formLayout} label="Authority">
        {form.getFieldDecorator('authority', {
          initialValue: formVals.authority,
        })(
          <Select mode="multiple" style={{ width: '100%' }}>
            {options}
          </Select>
        )}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateItemModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateItemModalVisible(false, values)}>
        Cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext()}>
        Save
      </Button>,
    ];
  };

  render() {
    const { updateItemModalVisible, handleUpdateItemModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Edit Item"
        visible={updateItemModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateItemModalVisible(false, values)}
        afterClose={() => handleUpdateItemModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ loading, menu, menuItem, rule }) => ({
  loading: loading.models.menu,
  menu,
  menuItem,
  rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    updateItemModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    stepFormItemValues: {},
  };

  columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'path',
    },
    {
      title: 'Vị trí',
      dataIndex: 'orderby',
    },

    {
      title: 'Icon',
      dataIndex: 'icon',
      align: 'right',
      render: val => <Icon type={val} />,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: 'Action',
      render: (text, record) => {
        let edit = <a onClick={() => this.handleUpdateItemModalVisible(true, record)}>Edit</a>;
        let menu = <a href="#">Menu</a>;
        if (record.parent) {
          edit = <a onClick={() => this.handleUpdateModalVisible(true, record)}>Add Item</a>;
        } else {
          menu = <a onClick={() => this.showDeleteConfirm(record)}>Xoá</a>;
        }
        return (
          <Fragment>
            {edit}
            <Divider type="vertical" />
            {menu}
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetch',
    });
    dispatch({
      type: 'menuItem/fetch',
    });
    dispatch({
      type: 'rule/fetch',
    });
  }

  showDeleteConfirm = record => {
    const { dispatch } = this.props;
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'menu/removeMenuItem',
          payload: {
            menuid: record.menuId,
            menuitemid: record.menuItemId,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handleUpdateItemModalVisible = (flag, record) => {
    this.setState({
      updateItemModalVisible: !!flag,
      stepFormItemValues: record || {},
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
      type: 'menu/fetch',
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
      type: 'menu/fetch',
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
      type: 'menu/add',
      payload: {
        name: fields.name,
      },
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
  };

  handleUpdateItem = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateItem',
      payload: fields,
    });
    this.handleUpdateItemModalVisible();
  };

  render() {
    const {
      menu: { table },
      loading,
      menuItem,
      rule,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      stepFormItemValues,
      updateItemModalVisible,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Xoá</Menu.Item>
        <Menu.Item key="approval">Thêm Item </Menu.Item>
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
    const updateItemMethods = {
      handleUpdateItemModalVisible: this.handleUpdateItemModalVisible,
      handleUpdateItem: this.handleUpdateItem,
    };
    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: record.menuId === undefined, // Column configuration not to be checked
        name: record.menuId,
      }),
    };
    return (
      <PageHeaderWrapper title="Quản trị menu">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                Thêm mới
              </Button>
              <Link to="/online/menu/item/add" icon="plus" type="primary">
                Thêm Menu Item
              </Link>
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
              rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...menuItem}
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {stepFormItemValues && Object.keys(stepFormItemValues).length ? (
          <UpdateItemForm
            rule={rule}
            {...updateItemMethods}
            updateItemModalVisible={updateItemModalVisible}
            values={stepFormItemValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
