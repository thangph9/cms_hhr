import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Form, Input, Button, Card, Radio, Icon, Checkbox } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';

const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

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
        values.answer = this.state.question.listAnswer; // eslint-disable-line
        dispatch({
          type: 'question/submitRegularForm',
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
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { question } = this.state;
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
                <Button size="small" onClick={() => this.handleEditAnswer(i)}>
                  <Icon type="edit" />
                </Button>
                <Button size="small" onClick={() => this.handleDeleteAnswer(e)}>
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
                <Button size="small" onClick={() => this.handleEditAnswer(i)}>
                  <Icon type="edit" />
                </Button>
                <Button size="small" onClick={() => this.handleDeleteAnswer(e)}>
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

            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="form.question.options.label" />}
              help={<FormattedMessage id="form.question.options.label.help" />}
            >
              <div>
                {getFieldDecorator('options', {
                  initialValue: '1',
                  onChange: this.handleChangeOptions,
                })(
                  <Radio.Group>
                    <Radio value="1">
                      <FormattedMessage id="form.question.radio.input" />
                    </Radio>
                    <Radio value="2">
                      <FormattedMessage id="form.question.radio.option" />
                    </Radio>
                    <Radio value="3">
                      <FormattedMessage id="form.question.radio.checkbox" />
                    </Radio>
                  </Radio.Group>
                )}
                <ListAnswer list={question} />
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('answer')(
                    <Input
                      onBlur={this.handleAnswerBlur}
                      placeholder={formatMessage({ id: 'form.answer.placeholder' })}
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
