/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable vars-on-top */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/button-has-type */
/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-useless-escape */
/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Row,
  Col,
  Checkbox,
  Skeleton,
  Cascader,
  Popover,
  Progress,
} from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;
@connect(({ list, user }) => ({
  list,
  user,
}))
@Form.create()
class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      callback: 'not fired',
      value: '',
      loadpage: false,
      expired: 'false',
      count: 0,
      confirmDirty: false,
      visible: false,
      help: '',
      prefix: '84',
      rule: 'member',
      form_pass: false,
      validateStt: '',
      help_pass: '',
      info: {
        name: 'Nguyễn Hữu Trí',
        phone: '0373962095',
        address: 'Hà Nội',
        username: 'trjvjp97@gmail.com',
      },
    };
  }
  handleClickEdit(item) {
    this.setState({
      [item]: !this.state[item],
    });
  }
  handleSubmitEdit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.user.info !== nextProps.user.info) {
      console.log(nextProps);
      this.setState({
        info: nextProps.user.info.info,
        status: nextProps.user.info.status,
      });
    }
  }
  handleClickSubmitEdit(item) {
    const { form, user } = this.props;
    const { info, status } = this.state;
    const fullname = form.getFieldValue('fullname');
    const phone = form.getFieldValue('phone');
    const address = form.getFieldValue('address');
    var valueInfo = {};
    valueInfo.fullname = fullname ? fullname : info.name;
    valueInfo.phone = phone ? phone : info.phone;
    valueInfo.address = address ? address : info.address;
    this.props.dispatch({
      type: 'user/changeinfo',
      payload: valueInfo,
    });
    this.setState({
      [item]: !this.state[item],
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'user/info',
      });
    }, 500);
  }
  handleClickInfomation() {
    this.setState({
      editAddress: undefined,
      editName: undefined,
      editPhone: undefined,
    });
  }
  render() {
    const { info, status } = this.state;
    var root = document.getElementById('root');
    const { count, prefix, help, visible, rule } = this.state;
    const { getFieldDecorator } = this.props.form;
    var { user } = this.props;
    var validateStt = '';
    var help_pass = '';
    console.log(status);
    if (status === 'error') {
      localStorage.removeItem('account');
      return <Redirect to={`/login`} />;
    }

    return (
      <div className={styles['jsx-157584619'] + ' ' + styles['content']}>
        <div className={styles['jsx-3523037850'] + ' ' + styles['container']}>
          <div className={styles['jsx-3523037850'] + ' ' + styles['row']}>
            <div
              className={
                styles['jsx-3523037850'] + ' ' + styles['col-md-9'] + ' ' + styles['box-shadow']
              }
            >
              <div className={styles['jsx-1038892047'] + ' ' + styles['user-account-settings']}>
                <div className={styles['jsx-4204020708'] + ' ' + styles['user-settigs-section']}>
                  <Form
                    onSubmit={e => this.handleSubmitEdit(e)}
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Arial, sans-serif',
                    }}
                  >
                    <div className={styles['row']}>
                      <div
                        style={{ lineHeight: '39px', padding: '0px', display: 'inline-flex' }}
                        className={styles['col-12']}
                      >
                        <Icon style={{ fontSize: '23px', marginRight: '5px' }} type="user" />
                        <h3>Thông tin cá nhân</h3>
                      </div>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Họ tên
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editName ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('fullname', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.name && info.name}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editName')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          info.name && info.name
                        )}
                        {this.state.editName ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editName')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles['row']}>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Địa chỉ email
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {info.username && info.username}
                      </div>
                    </div>
                    <div className={styles['row']}>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Số điện thoại
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editPhone ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('phone', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.phone && info.phone}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editPhone')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          info.phone && info.phone
                        )}
                        {this.state.editPhone ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editPhone')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles['row']}>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Địa chỉ
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editAddress ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('address', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.address && info.address}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editAddress')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          info.address && info.address
                        )}
                        {this.state.editAddress ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editAddress')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                  </Form>
                </div>
                <div className={styles['jsx-4204020708'] + ' ' + styles['user-settigs-section']}>
                  <div className={styles['jsx-4204020708']}>
                    {user.registerfb && user.registerfb.by == 'facebook' ? (
                      ''
                    ) : (
                      <div className={styles['jsx-3824923981']}>
                        <h4 className={styles['jsx-3824923981']} />
                        <span className={styles['jsx-3824923981']}>
                          <Link to={`/changepass`} className={styles['link-style']}>
                            Đổi mật khẩu
                          </Link>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles['jsx-3523037850'] + ' ' + styles['row']}
            style={{ marginTop: '10px' }}
          >
            <div
              className={
                styles['jsx-3523037850'] + ' ' + styles['col-md-9'] + ' ' + styles['box-shadow']
              }
            >
              <div className={styles['jsx-1038892047'] + ' ' + styles['user-account-settings']}>
                <div className={styles['jsx-4204020708'] + ' ' + styles['user-settigs-section']}>
                  <Form
                    onSubmit={e => this.handleSubmitEdit(e)}
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Arial, sans-serif',
                    }}
                  >
                    <div className={styles['row']}>
                      <div
                        style={{ lineHeight: '39px', padding: '0px', display: 'inline-flex' }}
                        className={styles['col-12']}
                      >
                        <Icon style={{ fontSize: '23px', marginRight: '5px' }} type="lock" />
                        <h3>Quyền riêng tư</h3>
                      </div>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Kết quả tìm kiếm công khai
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editName ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('fullname', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.name && info.name}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editName')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          'Đã bật'
                        )}
                        {this.state.editName ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editName')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles['row']}>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Duyệt ẩn danh
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editPhone ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('phone', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.phone && info.phone}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editPhone')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          'Đã Bật'
                        )}
                        {this.state.editPhone ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editPhone')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles['row']}>
                      <div style={{ lineHeight: '39px' }} className={styles['col-4']}>
                        Thông báo sinh nhật
                      </div>
                      <div
                        style={{ lineHeight: '39px' }}
                        className={
                          styles['col-8'] +
                          ' ' +
                          styles['text-right'] +
                          ' ' +
                          styles['text-truncate']
                        }
                      >
                        {this.state.editPhone ? (
                          <FormItem style={{ padding: 0, margin: 0 }}>
                            {getFieldDecorator('phone', {})(
                              <Input
                                style={{ width: '50%' }}
                                size="small"
                                placeholder={info.phone && info.phone}
                              />
                            )}
                            <Icon
                              onClick={() => this.handleClickSubmitEdit('editPhone')}
                              type="check-circle"
                              theme="twoTone"
                              twoToneColor="#16accf"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            />
                          </FormItem>
                        ) : (
                          'Đã Bật'
                        )}
                        {this.state.editPhone ? (
                          ''
                        ) : (
                          <Icon
                            onClick={() => this.handleClickEdit('editPhone')}
                            theme="twoTone"
                            twoToneColor="#16accf"
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            type="edit"
                          />
                        )}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
