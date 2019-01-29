import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
// import {Link} from 'react-router-dom'
// import styles from './styles.less';

@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
@Form.create()
class FormLogin extends PureComponent {
  state = {
    help: '',
    validateStatus: '',
  };

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.login !== nextProps.authentication.login) {
      if (
        nextProps.authentication.login.status === 'error' &&
        nextProps.authentication.login.timeline !== authentication.login.timeline
      ) {
        this.setState({
          help: nextProps.authentication.login.message,
          validateStatus: 'error',
        });
      }
      if (nextProps.authentication.login.status === 'ok') {
        nextProps.history.push({ pathname: '/home' });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      console.log(err, values);
      if (!err) {
        dispatch({
          type: 'authentication/login',
          payload: values,
        });
      }
    });
  };

  handleChangePhone(value) {
    console.log(value);
    this.setState({
      help: '',
      validateStatus: '',
    });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form;
    const { help, validateStatus } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
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
          })(<Input onChange={e => this.handleChangePhone(e)} />)}
        </Form.Item>
        <FormItem help={help} validateStatus={validateStatus} style={{ marginBottom: '0px' }} />
        <Form.Item label="Mật khẩu">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ],
          })(<Input type="password" />)}
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
            Đăng nhập
          </Button>
        </Form.Item>
        <a href="/forgot">Quên mật khẩu?</a>
      </Form>
    );
  }
}
export default FormLogin;
