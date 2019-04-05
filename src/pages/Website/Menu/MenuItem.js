import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ loading, menu, menuItem }) => ({
  menu,
  menuItem,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'menuItem/add',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const options = [
      <Option key="member" value="member">
        Member
      </Option>,
      <Option key="user" value="user">
        User
      </Option>,
      <Option key="guest" value="guest">
        Guest
      </Option>,
      <Option key="premium" value="premium">
        Premium
      </Option>,
      <Option key="silver" value="silver">
        Silver
      </Option>,
      <Option key="gold" value="gold">
        Gold
      </Option>,
      <Option key="diamond" value="diamond">
        Diamond
      </Option>,
      <Option key="platium" value="platium">
        Platium
      </Option>,
    ];
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Tên">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Yêu cầu nhập tên menu',
                  },
                ],
              })(<Input placeholder="Nhập tên menu" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Đường dẫn">
              {getFieldDecorator('path', {
                rules: [
                  {
                    required: true,
                    message: 'Yêu cầu nhập đường dẫn',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Icon">
              {getFieldDecorator('icon', {
                rules: [
                  {
                    required: true,
                    message: 'Chọn icon',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Active Icon">
              {getFieldDecorator('activeIcon', {
                rules: [
                  {
                    required: true,
                    message: 'Chọn icon',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Authority">
              {getFieldDecorator('authority', {})(
                <Select mode="multiple" style={{ width: '100%' }}>
                  {options}
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Save
              </Button>
              <Button style={{ marginLeft: 8 }}>Cancel</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
