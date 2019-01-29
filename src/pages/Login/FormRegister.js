import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Popover, Progress, Select } from 'antd';
// import {Link} from 'react-router-dom'
import styles from './styles.less';

const { Option } = Select;

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
const years = [
  2004,
  2003,
  2002,
  2001,
  2000,
  1999,
  1998,
  1997,
  1996,
  1995,
  1994,
  1993,
  1992,
  1991,
  1990,
  1989,
  1988,
  1987,
  1986,
  1985,
  1984,
  1983,
  1982,
  1981,
  1980,
  1979,
  1978,
  1977,
  1976,
  1975,
  1974,
  1973,
  1972,
  1971,
  1970,
  1969,
  1968,
  1967,
  1966,
  1965,
  1964,
  1963,
  1962,
  1961,
  1960,
  1959,
  1958,
  1957,
  1956,
  1955,
  1954,
  1953,
  1952,
  1951,
  1950,
  1949,
  1948,
  1947,
  1946,
  1945,
  1944,
  1943,
  1942,
  1941,
  1940,
  1939,
  1938,
  1937,
  1936,
  1935,
  1934,
  1933,
  1932,
  1931,
  1930,
  1929,
];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const dayInMonthFull = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];
const dayInMonthShort = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
];
const dayInFebruaryNormal = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
];
const dayInFebruaryProfit = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
];
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class FormRegister extends PureComponent {
  state = {
    visible: false,
    help: '',
    monthSelected: [],
  };

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;

    if (authentication.register !== nextProps.authentication.register) {
      if (nextProps.authentication.register.status === 'ok') {
        nextProps.history.push({ pathname: '/registerresult' });
      }
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    // const email = this.props.form.getFieldValue('email');
    // const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // if (!filter.test(email)) {
    // return;
    // }
    const day = form.getFieldValue('day');
    const month = form.getFieldValue('month');
    const year = form.getFieldValue('year');
    const gender = form.getFieldValue('gender');
    if (!gender) {
      form.setFields({
        gender: {
          errors: [new Error('Chọn giới tính!')],
        },
      });
    }
    if (!day || !month || !year) {
      form.setFields({
        day: {
          errors: [new Error('Chọn đầy đủ ngày sinh!')],
        },
      });
    }
    form.validateFields((err, values) => {
      if (values.password !== values.repassword) {
        form.setFields({
          repassword: {
            value: values.repassword,
            errors: [new Error('Nhập lại mật khẩu sai vui lòng kiểm tra lại!')],
          },
        });
      }
      if (values.password === values.repassword) {
        if (!err && day && month && year && gender) {
          dispatch({
            type: 'authentication/register',
            payload: values,
          });
        }
      }
    });
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Nhập mật khẩu！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
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
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
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

  validEmailSync = e => {
    const { form } = this.props;
    const email = e.target.value;
    const filter = /^([a-zA-Z0-9_])+(([a-zA-Z0-9])+)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      form.setFields({
        email: {
          value: email,
          errors: [new Error('Sai định dạng Email! Vui lòng kiểm tra lại')],
        },
      });
    }
  };

  handleChangeGender = value => {
    console.log(value);
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.setFields({
      gender: {
        errors: '',
      },
    });
  };

  handleChangeDay = value => {
    console.log(value);
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.setFields({
      day: {
        errors: '',
      },
    });
  };

  handleChangeIntent = value => {
    console.log(value);
  };

  handleChangeMonth = value => {
    const { form } = this.props;
    const year = form.getFieldValue('year');
    if (year % 4 === 0 && value === 2) {
      this.setState(
        {
          monthSelected: dayInFebruaryProfit,
        },
        () => {
          const day = form.getFieldValue('day');
          if (day > 29) {
            form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (value === 2) {
      this.setState(
        {
          monthSelected: dayInFebruaryNormal,
        },
        () => {
          const day = form.getFieldValue('day');
          if (day > 28) {
            form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (
      value === 1 ||
      value === 3 ||
      value === 5 ||
      value === 7 ||
      value === 8 ||
      value === 10 ||
      value === 12
    ) {
      this.setState({
        monthSelected: dayInMonthFull,
      });
      return;
    }
    if (value === 4 || value === 6 || value === 9 || value === 11) {
      this.setState(
        {
          monthSelected: dayInMonthShort,
        },
        () => {
          const day = form.getFieldValue('day');
          if (day > 30) {
            form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
    }
  };

  handleChangeYear = value => {
    const { form } = this.props;
    const month = form.getFieldValue('month');
    if (value % 4 === 0 && month === 2) {
      this.setState(
        {
          monthSelected: dayInFebruaryProfit,
        },
        () => {
          const day = form.getFieldValue('day');
          if (day > 29) {
            form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (month === 2) {
      this.setState(
        {
          monthSelected: dayInFebruaryNormal,
        },
        () => {
          const day = form.getFieldValue('day');
          if (day > 28) {
            form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
    }
  };

  validRepassword() {
    const { form } = this.props;
    const password = form.getFieldValue('password');
    const repassword = form.getFieldValue('repassword');
    if (password !== repassword) {
      form.setFields({
        repassword: {
          value: repassword,
          errors: [new Error('Nhập lại mật khẩu sai vui lòng kiểm tra lại!')],
        },
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { help, visible, monthSelected } = this.state;
    const A = [];
    dayInMonthFull.map((v, i) => {
      A[i] = (
        <Option key={v} value={v}>
          {v}
        </Option>
      );
      return A;
    });
    const B = [];
    monthSelected.map((v, i) => {
      B[i] = (
        <Option key={v} value={v}>
          {v}
        </Option>
      );
      return A;
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label="Tên"
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Nhập tên bạn',
              },
            ],
          })(<Input placeholder="Ví dụ bạn là Trí" />)}
        </Form.Item>
        <Form.Item
          label="Giới tính"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('gender', {
            required: true,
            message: 'Nhập giới tính',
            onChange: this.handleChangeGender,
          })(
            <Select placeholder="Bạn là...">
              <Option value="men">Nam</Option>
              <Option value="woman">Nữ</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Ngày sinh" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('day', {
            onChange: this.handleChangeDay,
          })(
            <Select style={{}} placeholder="Ngày">
              {monthSelected.length > 0 ? A : B}
            </Select>
          )}
          {getFieldDecorator('month', {
            onChange: this.handleChangeMonth,
          })(
            <Select placeholder="Tháng">
              {months.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
          {getFieldDecorator('year', {
            onChange: this.handleChangeYear,
          })(
            <Select placeholder="Năm">
              {years.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập địa chỉ',
              },
            ],
          })(<Input placeholder="Ví dụ Hà Nội" />)}
        </Form.Item>
        <Form.Item
          label="Bạn ở đây để"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('intent', {
            onChange: this.handleChangeIntent,
          })(
            <Select placeholder="Chọn...">
              <Option value="chat">Chat</Option>
              <Option value="pal">Kết bạn</Option>
              <Option value="dating">Hẹn hò</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Số điện thoại" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập số điện thoại',
              },
              {
                pattern: /\d{9}$/,
                message: 'Nhập sai định dạng hoặc chưa đủ chữ số！',
              },
            ],
          })(<Input placeholder="Số điện thoại là tài khoản đăng nhập" />)}
        </Form.Item>
        <Form.Item help={help} label="Mật khẩu" style={{ marginBottom: '0px' }}>
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>Mât khẩu ít nhất 6 ký tự</div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(<Input type="password" placeholder="Tối thiểu 6 ký tự" />)}
          </Popover>
        </Form.Item>
        <Form.Item label="Nhập lại">
          {getFieldDecorator('repassword', {
            rules: [
              {
                required: true,
                message: 'Nhập lại mật khẩu!',
              },
            ],
          })(
            <Input
              onBlur={e => this.validRepassword(e)}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            style={{
              background: '#45c000',
              borderColor: '#45c000',
              color: '#fff',
              borderRadius: '30px',
            }}
            htmlType="submit"
            block
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default FormRegister;
