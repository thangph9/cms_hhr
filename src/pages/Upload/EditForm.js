import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Radio,
  Icon,
  Tooltip,
  Upload,
  Checkbox,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ loading, track }) => ({
  submitting: loading.effects['track/submitUpdate'],
  track,
}))
@Form.create()
class BasicForms extends PureComponent {
  state = {
    fileID: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    try {
      dispatch({
        type: 'track/fetchTrackByID',
        payload: match.params.track_id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  handleSubmit = e => {
    const {
      dispatch,
      form,
      match,
      track: { track },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.fileID = this.state.fileID || track.audio; // eslint-disable-line
        values.track_id = match.params.track_id; // eslint-disable-line
        delete values.upload; // eslint-disable-line

        dispatch({
          type: 'track/submitUpdate',
          payload: values,
        });
      }
    });
  };

  normFile = e => {
    try {
      this.setState({
        fileID: e.file.response.file.audioid,
      });
    } catch (ex) {
      console.log(ex);
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  onChange = e => {
    console.log(e);
  };

  uploadYoutube = e => {
    console.log(e);
  };

  render() {
    const {
      submitting,
      track: { track },
    } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
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
                initialValue: track.title,
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Đài">
              {getFieldDecorator('local', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
                initialValue: track.local,
              })(
                <Select>
                  <Option value="HN">Hà Nội</Option>
                  <Option value="HCM">Tp.HCM</Option>
                </Select>
              )}
            </FormItem>
            <Form.Item {...formItemLayout} label="Upload">
              {getFieldDecorator('upload', {
                getValueFromEvent: this.normFile,
              })(
                <Upload name="file" action="/upload/audio" listType="picture">
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.date.required' }),
                  },
                ],
                initialValue: moment(track.date),
              })(<DatePicker onChange={this.onChange} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.goal.label" />}>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.goal.required' }),
                  },
                ],
                initialValue: track.description,
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  MC
                  <em className={styles.optional}>
                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('mc', {
                initialValue: track.mc,
              })(<Input placeholder={formatMessage({ id: 'form.client.placeholder' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="form.public.label" />}
              help={<FormattedMessage id="form.public.label.help" />}
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: track.status,
                })(
                  <Radio.Group>
                    <Radio value="1">
                      <FormattedMessage id="form.public.radio.public" />
                    </Radio>
                    <Radio value="2">
                      <FormattedMessage id="form.public.radio.partially-public" />
                    </Radio>
                    <Radio value="3">
                      <FormattedMessage id="form.public.radio.private" />
                    </Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">
                        <FormattedMessage id="form.publicUsers.option.A" />
                      </Option>
                      <Option value="2">
                        <FormattedMessage id="form.publicUsers.option.B" />
                      </Option>
                      <Option value="3">
                        <FormattedMessage id="form.publicUsers.option.C" />
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.public" />}>
              <div>
                {getFieldDecorator('youtube', {
                  initialValue: track.youtube,
                })(<Checkbox onChange={this.uploadYoutube}>Youtube</Checkbox>)}
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
