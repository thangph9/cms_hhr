import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';

const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  state = {
    question: {
      listAnswer: [],
      questionType: 1,
    },
    stateStatus: 'add',
    index: 0,
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: 'group/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleAnswerBlur = e => {
    const value = e.target;
    const {
      question: { listAnswer, questionType },
      index,
      stateStatus,
    } = this.state;
    const { form } = this.props;
    form.setFieldsValue({ answer: '' });
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

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
