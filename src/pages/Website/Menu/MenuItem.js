import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ loading, menu, menuItem, rule }) => ({
  menu,
  menuItem,
  submitting: loading.effects['form/submitRegularForm'],
  rule,
}))
@Form.create()
class BasicForms extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

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
    const { submitting, rule } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
