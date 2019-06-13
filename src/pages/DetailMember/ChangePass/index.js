/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Input, Button, Skeleton, message, Form, Popover, Progress } from 'antd';
import styles from './index.less';

const passwordStatusMap = {
  ok: <div className={styles.success}>Mức độ：Mạnh</div>,
  pass: <div className={styles.warning}>Mức độ：Vừa</div>,
  poor: <div className={styles.error}>Mức độ：Yếu</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ members }) => ({
  getmemberbyid: members.getmemberbyid,
}))
@Form.create()
class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      help: '',
      helpRePass: '',
      checkCharPass: '',
      valiRePass: '',
      editEmail: false,
      editPhone: false,
      valuePhone: '',
      valueEmail: '',
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'members/getmemberbyid',
      payload: this.props.location.query.id,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { getmemberbyid } = this.props;
    if (getmemberbyid !== nextProps.getmemberbyid) {
      this.setState({
        dataUser: nextProps.getmemberbyid.result,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const repassword = form.getFieldValue('repassword');
    const newpassword = form.getFieldValue('newpassword');
    if (!repassword) {
      this.setState({
        helpRePass: 'Nhập lại mật khẩu !',
        valiRePass: 'error',
      });
    } else if (newpassword !== repassword) {
      this.setState({
        helpRePass: 'Nhập lại mật khẩu chưa đúng!',
        valiRePass: 'error',
      });
    }
    form.validateFields((err, values) => {
      if (!err) {
        if (values.repassword !== values.newpassword) {
          return;
        }
        // eslint-disable-next-line no-param-reassign
        values.user_id = this.props.location.query.id;
        dispatch({
          type: 'members/changepass',
          payload: values,
        });
      }
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newpassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  renderPasswordProgress = () => {
    const { checkCharPass } = this.state;
    const { form } = this.props;
    const value = form.getFieldValue('newpassword');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <span style={{ color: 'red' }}>{checkCharPass}</span>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Nhập mật khẩu！',
        valiPass: 'error',
        visible: !!value,
      });
      callback('error');
    } else if (/^[a-zA-z0-9!@#$%^&*_\-=+|;:]{1,}$/.test(value) === false) {
      this.setState({
        checkCharPass: 'Mật khẩu đang chứa ký tự đặc biệt',
        help: 'Mật khẩu đang chứa ký tự đặc biệt',
        valiPass: 'error',
        visible: true,
      });
    } else {
      this.setState({
        checkCharPass: '',
        valiPass: '',
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        this.setState({
          valiPass: 'success',
        });
        callback();
      }
    }
  };

  validRepassword() {
    const { form } = this.props;
    const password = form.getFieldValue('newpassword');
    const repassword = form.getFieldValue('repassword');
    if (password !== repassword) {
      this.setState({
        valiRePass: 'error',
        helpRePass: 'Nhập lại mật khẩu chưa đúng!',
      });
    }
  }

  handleClosePass() {
    this.setState({
      visible: false,
    });
  }

  handleChangeRePass(e) {
    this.setState({
      valiRePass: '',
      helpRePass: '',
    });
    const { value } = e.target;
    const { form } = this.props;
    const password = form.getFieldValue('newpassword');
    if (password === value) {
      this.setState({
        valiRePass: 'success',
      });
    }
  }

  handleChangeEmail() {
    this.setState({
      editEmail: true,
    });
  }

  handleChangePhone() {
    this.setState({
      editPhone: true,
    });
  }

  handleDonePhone() {
    const { valuePhone } = this.state;
    const { dispatch } = this.props;
    if (/^\d{10}$/.test(valuePhone) === false) {
      message.error('Số điện thoại không đúng!');
      return;
    }
    dispatch({
      type: 'members/updatephone',
      payload: {
        phone: valuePhone,
        user_id: this.props.location.query.id,
      },
    });
    this.setState({
      editPhone: false,
    });
  }

  handleDoneEmail() {
    const { valueEmail } = this.state;
    const { dispatch } = this.props;
    if (
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(valueEmail) === false
    ) {
      message.error('Email không đúng định dạng!');
      return;
    }
    dispatch({
      type: 'members/updateemail',
      payload: {
        email: valueEmail,
        user_id: this.props.location.query.id,
      },
    });
    this.setState({
      editEmail: false,
    });
  }

  handleChangeInputPhone(e) {
    this.setState({
      valuePhone: e.target.value,
    });
  }

  handleChangeInputEmail(e) {
    this.setState({
      valueEmail: e.target.value,
    });
  }

  render() {
    const {
      visible,
      help,
      dataUser,
      editPhone,
      editEmail,
      valiPass,
      helpRePass,
      valiRePass,
    } = this.state;
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    if (dataUser && !loading) {
      return (
        <div className={styles['cai-dat-bao-mat']}>
          <div className={styles.item}>
            <div className={styles['title-item']}>
              Điện thoai liên hệ
              {!editPhone ? (
                <Icon
                  onClick={() => this.handleChangePhone()}
                  type="edit"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Icon
                  onClick={() => this.handleDonePhone()}
                  type="check-circle"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              )}
              {editPhone ? (
                <Input
                  onChange={e => this.handleChangeInputPhone(e)}
                  size="small"
                  style={{ marginTop: '5px', width: '40%', display: 'block' }}
                  placeholder="Nhập số điện thoại của bạn"
                />
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  Số điện thoại:{' '}
                  <span className={styles['text-item']}>
                    {' '}
                    {dataUser.phones ? dataUser.phones['1'] : dataUser.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles['title-item']}>
              Địa chỉ khôi phục{' '}
              {!editEmail ? (
                <Icon
                  onClick={() => this.handleChangeEmail()}
                  type="edit"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Icon
                  onClick={() => this.handleDoneEmail()}
                  type="check-circle"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              )}
              {editEmail ? (
                <Input
                  onChange={e => this.handleChangeInputEmail(e)}
                  size="small"
                  style={{ marginTop: '5px', width: '40%', display: 'block' }}
                  placeholder="Nhập email của bạn"
                />
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  Email:{' '}
                  <span className={styles['text-item']}>
                    {' '}
                    {dataUser.email ? dataUser.email : 'Chưa có'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles['title-item']}>
              Thay đổi mật khẩu
              {
                <Icon
                  onClick={() => this.handleChangeFormPass()}
                  style={{
                    display: 'inline',
                    marginLeft: '4px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                  type="edit"
                />
              }
              {
                <div className={styles['form-pass']}>
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập mật khẩu',
                          },
                        ],
                      })(
                        <Input
                          size="large"
                          type="password"
                          autoComplete="password"
                          placeholder="Mật khẩu hiện tại"
                        />
                      )}
                    </Form.Item>
                    <Form.Item help={help} validateStatus={valiPass} hasFeedback>
                      <Popover
                        content={
                          <div style={{ padding: '4px 0' }}>
                            <Icon
                              onClick={() => this.handleClosePass()}
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                cursor: 'pointer',
                              }}
                              type="close"
                            />
                            {passwordStatusMap[this.getPasswordStatus()]}
                            {this.renderPasswordProgress()}
                            <div style={{ marginTop: 10 }}>Mât khẩu ít nhất 6 ký tự</div>
                          </div>
                        }
                        overlayStyle={{ width: 240 }}
                        placement="right"
                        visible={visible}
                      >
                        {getFieldDecorator('newpassword', {
                          rules: [
                            {
                              validator: this.checkPassword,
                            },
                          ],
                        })(
                          <Input
                            size="large"
                            type="password"
                            autoComplete="password"
                            placeholder="Mật khẩu mới"
                          />
                        )}
                      </Popover>
                    </Form.Item>
                    <Form.Item help={helpRePass} validateStatus={valiRePass} hasFeedback>
                      {getFieldDecorator('repassword', {
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Input
                          size="large"
                          autoComplete="repassword"
                          onChange={e => this.handleChangeRePass(e)}
                          onBlur={e => this.validRepassword(e)}
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button block size="large" type="primary" htmlType="submit">
                        Thay đổi mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${styles['cai-dat-bao-mat']} cai-dat-bao-mat`}>
        <div
          style={{
            background: '#fff',
            paddingTop: '24px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f3f5f9',
          }}
        >
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
        </div>
        <div
          style={{
            background: '#fff',
            paddingTop: '24px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f3f5f9',
          }}
        >
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
        </div>
        <div style={{ background: '#fff', paddingTop: '32px', paddingBottom: '18px' }}>
          <Skeleton title={false} active paragraph={{ rows: 1 }} />
        </div>
      </div>
    );
  }
}

export default ChangePass;
