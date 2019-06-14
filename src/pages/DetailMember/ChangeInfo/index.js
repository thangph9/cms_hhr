/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Icon, Input, Button, Skeleton, Form, Radio, Select, Upload, Tooltip, message } from 'antd';
import styles from './index.less';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;
const years = [
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
@connect(({ members }) => ({
  getmemberbyid: members.getmemberbyid,
}))
@Form.create()
class ThongTinCaNhan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedAvatar: false,
      loadingUpdateAvatar: false,
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
      this.setState(
        {
          dataUser: nextProps.getmemberbyid.result,
          avatarImage: nextProps.getmemberbyid.result.avatar,
          resetAvatar: false,
        },
        () => {
          const { avatarImage } = this.state;

          const imgLoader = new Image();
          imgLoader.src = `http://cdn.henhoradio.net/images/ft/${avatarImage}`;
          imgLoader.onload = () => {
            if (this.imgElm && avatarImage) {
              this.imgElm.style.backgroundImage = `url(http://cdn.henhoradio.net/images/ft/${avatarImage})`;
              this.setState({
                loadedAvatar: true,
              });
            }
          };
        }
      );
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    const { avatarImage } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      values.avatar = avatarImage;
      values.user_id = this.props.location.query.id;
      if (!err) {
        dispatch({
          type: 'members/updateprofileuser',
          payload: values,
        });
      }
    });
  };

  beforeUploadAvatar = file => {
    const isJPG =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webm' ||
      file.type === 'image/webp';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 12;
    if (!isLt2M) {
      message.error('Image must smaller than 12MB!');
    }
    return isJPG && isLt2M;
  };

  handleResetAvatar() {
    const { dataUser } = this.state;
    this.setState({
      resetAvatar: false,
      avatarImage: dataUser.avatar,
    });
  }

  componentWillUpdate(nextProps, nextStates) {
    if (this.state.avatarImage !== nextStates.avatarImage) {
      this.setState(
        {
          loadedAvatar: false,
        },
        () => {
          const { avatarImage } = nextStates;
          const imgLoader = new Image();
          imgLoader.src = `http://cdn.henhoradio.net/images/ft/${avatarImage}`;
          imgLoader.onload = () => {
            if (this.imgElm && avatarImage) {
              this.imgElm.style.backgroundImage = `url(http://cdn.henhoradio.net/images/ft/${avatarImage})`;
              this.setState({
                loadedAvatar: true,
                loadingUpdateAvatar: false,
              });
            }
          };
        }
      );
    }
  }

  handleChangeUpload(e) {
    let image = '';
    if (e.file.response) {
      if (e.file.response.status === 'ok') {
        image = e.file.response.file.imageId;
        this.setState({
          avatarImage: image,
          resetAvatar: true,
          loadingUpdateAvatar: true,
        });
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const { dataUser } = this.state;
    if (dataUser && !loading) {
      return (
        <div className={styles['thong-tin-ca-nhan']}>
          <div className={styles['form-edit']}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label="Tên đầy đủ">
                {getFieldDecorator('fullname', {
                  rules: [
                    { required: true, message: 'Vui lòng nhập đầy đủ tên của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,30}$/,
                    },
                  ],
                  initialValue: dataUser.fullname,
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <Form.Item label="Giới tính">
                {getFieldDecorator('gender', {
                  rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                  initialValue: dataUser.gender,
                })(
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="male">Nam</Radio.Button>
                    <Radio.Button value="female">Nữ</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <div className={styles['date-of-birth']}>
                <Form.Item label="Ngày sinh">
                  {getFieldDecorator('dateinfo', {
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_day,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {dayInMonthFull.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Tháng sinh">
                  {getFieldDecorator('monthinfo', {
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_month,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {months.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Năm sinh">
                  {getFieldDecorator('yearinfo', {
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_year,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {years.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Địa chỉ">
                {getFieldDecorator('address', {
                  rules: [
                    { required: true, message: 'Vui lòng chọn địa chỉ' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.address,
                })(<Input prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <div className={styles['date-of-birth']}>
                <Form.Item label="Chiều cao">
                  {getFieldDecorator('height', {
                    rules: [{ required: true, message: 'Vui lòng nhập chiều cao' }, {}],
                    initialValue: dataUser.height ? dataUser.height : '',
                  })(
                    <Input type="number" min={0} style={{ width: '70%' }} placeholder="Centimet" />
                  )}
                </Form.Item>
                <Form.Item label="Cân nặng">
                  {getFieldDecorator('weight', {
                    rules: [{ required: true, message: 'Vui lòng nhập cân nặng' }, {}],
                    initialValue: dataUser.weight ? dataUser.weight : '',
                  })(
                    <Input type="number" min={0} placeholder="Kilogram" style={{ width: '70%' }} />
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Trình độc học vấn">
                {getFieldDecorator('education', {
                  rules: [
                    { required: true, message: 'Nhập trình độ học vấn của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.education ? dataUser.education.education : '',
                })(
                  <Input
                    prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Bạn từng học đến cấp độ nào?"
                  />
                )}
              </Form.Item>
              <Form.Item label="Công việc hiện tại">
                {getFieldDecorator('jobs', {
                  rules: [
                    { required: true, message: 'Nhập công việc của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.jobs ? dataUser.jobs.jobs : '',
                })(
                  <Input
                    prefix={<Icon type="build" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Công việc chính hiện tại?"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles['basic-center']} />
          <div className={styles['avatar-image']}>
            <div
              ref={imgElm => (this.imgElm = imgElm)}
              className={styles['background-avatar']}
              style={{
                backgroundImage:
                  dataUser.gender === 'male'
                    ? `url(http://cdn.henhoradio.net/images/ft/ddc8448a-9c0d-4b70-a4c4-19bc3fb7a04c)`
                    : dataUser.gender === 'female' &&
                      `url(http://cdn.henhoradio.net/images/ft/3b10bc5e-7741-41e4-88ee-0174e2d6f0cd)`,
                backgroundColor: this.state.loadedAvatar ? 'none' : 'rgb(242, 242, 242)',
              }}
            >
              {this.state.loadingUpdateAvatar && (
                <div className={styles['loading-circle']}>
                  <div className={styles['lds-spinner']}>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              )}
              {this.state.resetAvatar && !this.state.loadingUpdateAvatar ? (
                <Tooltip placement="right" title="Huỷ bỏ">
                  <Icon
                    style={{ float: 'right', fontSize: '18px' }}
                    onClick={() => this.handleResetAvatar()}
                    type="close"
                  />
                </Tooltip>
              ) : (
                ''
              )}
            </div>
            <div className={`${styles['upload-button']} upload-avatar`}>
              <Form.Item>
                <Upload
                  onChange={e => this.handleChangeUpload(e)}
                  action="https://henhoradio.net/upload/images"
                  name="file"
                  beforeUpload={this.beforeUploadAvatar}
                >
                  <Button icon="upload">Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </div>

            <div className={styles['more-information']}>
              <div className={styles['item-info']}>
                Tên tài khoản: <span>{dataUser.phone}</span>
              </div>
              <div className={styles['item-info']}>
                Ngày đăng ký: <span>{moment(dataUser.createat).format('DD/MM/YYYY')}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${styles['thong-tin-ca-nhan']} thong-tin-ca-nhan`}>
        <div className={styles['form-edit']}>
          <div>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '25px', width: '115px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '45px' }}>
            {' '}
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '35px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '35px' }}>
            {' '}
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, paddingRight: '5px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '5px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '25px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '30px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div className="button-stelekon" style={{ paddingTop: '40px' }}>
            {' '}
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
        </div>

        <div className={styles['basic-center']} />
        <div className={styles['avatar-image']} style={{ position: 'relative' }}>
          <div className={styles['background-avatar']} style={{ background: '#f2f2f2' }} />
          <div className="upload-stelekon" style={{ width: '100%' }}>
            {' '}
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
          <div style={{ width: '100%', transform: 'translateY(70px)' }}>
            <Skeleton title={false} paragraph={{ rows: 1 }} />
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
        </div>
      </div>
    );
  }
}

export default ThongTinCaNhan;
