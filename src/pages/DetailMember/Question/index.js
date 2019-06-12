/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Input, Button, Skeleton, Radio, Checkbox, message, Tooltip } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(({ members }) => ({
  getmemberbyid: members.getmemberbyid,
}))
class HoiDapCaNhan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      list: [],
      question: [],
      title: [],
      type: '0',
      arrRadio: [],
      arrCheck: [],
      arrTextAria: [],
      submitEnable: true,
      'item-editing': undefined,
      groupQuestion: [],
      listQuestion: undefined,
      validateText: true,
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
          question: nextProps.getmemberbyid.question,
          title: nextProps.getmemberbyid.title,
          group: nextProps.getmemberbyid.group,
        },
        () => {
          const { title, question } = this.state;
          const arrGroup = [];
          title.forEach(element => {
            arrGroup.push(element.group_id);
          });
          this.setState({
            groupQuestion: Array.from(new Set(arrGroup)),
          });
          const arr = [];
          for (let i = 0; i < title.length; i++) {
            for (let j = 0; j < question.length; j++) {
              if (question[j].question_id === title[i].question_id) {
                const obj = {};
                obj.question_id = question[j].question_id;
                obj.title = title[i].title;
                obj.answer = question[j].answer;
                obj.groupid = title[i].group_id;
                arr.push(obj);
              }
            }
          }
          this.setState({
            list: arr,
          });
        }
      );
    }
  }

  getAnswerQuestion(value) {
    const { list } = this.state;
    const answer = list.find(element => element.question_id === value);
    if (answer) return answer.answer.toString();
    return '';
  }

  getTitleGroup(value) {
    const { group } = this.state;
    return group.find(e => e.group_id === value).title;
  }

  getTitleQuestion(value) {
    const { title } = this.state;
    return title.find(element => element.question_id === value).title;
  }

  handleCancer() {
    this.setState({
      'item-editing': undefined,
      editing: false,
      questionEditing: undefined,
      submitEnable: true,
      validateText: true,
    });
  }

  handleSubmitEdit(value) {
    const { dispatch } = this.props;
    const { arrTextAria, arrRadio, arrCheck } = this.state;
    if (value.type === '1') {
      dispatch({
        type: 'members/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrTextAria,
          user_id: this.props.location.query.id,
        },
      });
    } else if (value.type === '2') {
      dispatch({
        type: 'members/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrRadio,
          user_id: this.props.location.query.id,
        },
      });
    } else if (value.type === '3') {
      dispatch({
        type: 'members/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrCheck,
          user_id: this.props.location.query.id,
        },
      });
    }
    this.setState({
      'item-editing': undefined,
      editing: false,
      questionEditing: undefined,
      submitEnable: true,
    });
  }

  handleClickListQuestion(v) {
    const { listQuestion } = this.state;
    if (listQuestion === v) {
      this.setState({
        listQuestion: undefined,
        editing: false,
      });
    } else {
      this.setState({
        listQuestion: v,
        editing: true,
      });
    }
  }

  handleClickQuestionItem(element, value) {
    this.setState({
      [`question-number-${element}`]: value,
      listQuestion: undefined,
      editing: false,
    });
  }

  checkQuestionAnswered(value) {
    const { list } = this.state;
    const question = list.find(element => element.question_id === value);
    if (question) return true;
    return false;
  }

  handleClickEdit(v, e) {
    const { title } = this.state;
    const type = title.find(element => element.question_id === e);
    const { list } = this.state;
    if (type.type === '1') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrTextAria: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '2') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrRadio: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '3') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrCheck: answer.answer,
          submitEnable: false,
        });
      }
    }
    this.setState({
      editing: true,
      'item-editing': v,
      questionEditing: type,
      type: type.type,
    });
  }

  handleChangeRadioEditing(e) {
    if (e.target.value.length > 0) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }
    this.setState({
      arrRadio: [e.target.value],
    });
  }

  handleChangeCheckEditing(e) {
    if (e.length > 0 || (e[0] !== undefined && e[0] === '')) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }

    if (e[0] !== undefined && e[0] === '') {
      e.splice(0, 1);

      this.setState({
        arrCheck: e,
      });
    } else {
      this.setState({
        arrCheck: e,
      });
    }
  }

  handleChangeTexeAria(e) {
    const { value } = e.target;
    if (
      value.length > 0 &&
      /^[a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z0-9 .,-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ!@()]{0,200}$/.test(
        value
      ) === true
    ) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }
    this.setState({
      arrTextAria: [value],
    });
  }

  handleBlurTextAria(e) {
    const { value } = e.target;
    if (
      value.length === 0 ||
      /^[a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z0-9 .,-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ!@()]{0,200}$/.test(
        value
      ) === false
    ) {
      message.warning('Số lượng ký tự quá dài hoặc chứa ký tự không hợp lệ!');
    }
  }

  render() {
    const { groupQuestion, listQuestion, editing } = this.state;
    const { loading } = this.props;
    if (groupQuestion.length > 0 && !loading) {
      return (
        <div className="text-form">
          {editing && <div className={styles.editing} />}
          {groupQuestion.map(element => (
            <div key={`${element}`}>
              {this.state['item-editing'] && this.state['item-editing'] === element ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>
                        <span> {this.getTitleGroup(element)}</span>
                      </div>
                      <span className={styles['question-title']}>
                        {this.state.title.filter(e => e.group_id === element).length > 0 &&
                          this.getTitleQuestion(
                            !this.state[`question-number-${element}`]
                              ? this.state.title.filter(e => e.group_id === element)[0].question_id
                              : this.state[`question-number-${element}`]
                          )}
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      {this.state.type === '1' && (
                        <div style={{ width: '100%' }}>
                          <TextArea
                            onChange={e => this.handleChangeTexeAria(e)}
                            onBlur={e => this.handleBlurTextAria(e)}
                            style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                            rows={8}
                            defaultValue={
                              this.state.title.filter(e => e.group_id === element).length > 0 &&
                              this.getAnswerQuestion(
                                !this.state[`question-number-${element}`]
                                  ? this.state.title.filter(e => e.group_id === element)[0]
                                      .question_id
                                  : this.state[`question-number-${element}`]
                              )
                            }
                          />
                        </div>
                      )}
                      {this.state.type === '2' && (
                        <div className={`${styles['radio-group']} radio-form`}>
                          <RadioGroup
                            onChange={e => this.handleChangeRadioEditing(e)}
                            defaultValue={this.getAnswerQuestion(
                              !this.state[`question-number-${element}`]
                                ? this.state.title.filter(e => e.group_id === element)[0]
                                    .question_id
                                : this.state[`question-number-${element}`]
                            )}
                          >
                            {this.state.questionEditing.answer.map((v, i) => (
                              <div key={i} className={styles['radio-question']}>
                                <Radio
                                  style={{
                                    color: '#fff',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '20px',
                                  }}
                                  value={v}
                                >
                                  {v}
                                </Radio>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      {this.state.type === '3' && (
                        <div className={`${styles['radio-group']} radio-form`}>
                          <CheckboxGroup
                            style={{ width: '100%' }}
                            onChange={e => this.handleChangeCheckEditing(e)}
                            defaultValue={this.getAnswerQuestion(
                              !this.state[`question-number-${element}`]
                                ? this.state.title.filter(e => e.group_id === element)[0]
                                    .question_id
                                : this.state[`question-number-${element}`]
                            ).split(',')}
                          >
                            {this.state.questionEditing.answer.map((v, i) => (
                              <div key={i} className={styles['radio-question']}>
                                <Checkbox
                                  style={{
                                    color: '#fff',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '20px',
                                  }}
                                  value={v}
                                >
                                  {v}
                                </Checkbox>
                              </div>
                            ))}
                          </CheckboxGroup>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles['button-editing']}>
                    <Button
                      onClick={() => this.handleCancer()}
                      style={{ marginRight: '5px' }}
                      shape="round"
                      size="large"
                    >
                      CANCER
                    </Button>
                    <Button
                      disabled={this.state.submitEnable}
                      onClick={() => this.handleSubmitEdit(this.state.questionEditing)}
                      style={{ marginRight: '5px' }}
                      type="primary"
                      shape="round"
                      icon="check"
                      size="large"
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={styles['form-edit-item']}
                  style={listQuestion === element ? { zIndex: 3 } : {}}
                >
                  <div
                    onClick={() => this.handleClickListQuestion(element)}
                    className={styles['question-item']}
                  >
                    <div className={styles['theme-question']}>
                      <span> {this.getTitleGroup(element)}</span>
                      {listQuestion && listQuestion === element ? (
                        <Icon type="caret-up" />
                      ) : (
                        <Icon type="caret-down" />
                      )}
                    </div>
                    <span className={styles['question-title']}>
                      {this.state.title.filter(e => e.group_id === element).length > 0 &&
                        this.getTitleQuestion(
                          !this.state[`question-number-${element}`]
                            ? this.state.title.filter(e => e.group_id === element)[0].question_id
                            : this.state[`question-number-${element}`]
                        )}
                    </span>
                  </div>
                  {listQuestion && listQuestion === element && (
                    <div className={styles['list-question-hidden']}>
                      {this.state.title
                        .filter(e => e.group_id === element)
                        .map((v, i) => {
                          if (
                            v.title ===
                            this.getTitleQuestion(
                              !this.state[`question-number-${element}`]
                                ? this.state.title.filter(e => e.group_id === element)[0]
                                    .question_id
                                : this.state[`question-number-${element}`]
                            )
                          ) {
                            return '';
                          }
                          return (
                            <div
                              onClick={() => this.handleClickQuestionItem(element, v.question_id)}
                              key={i}
                              className={styles['item-question']}
                            >
                              <span>{v.title}</span>
                              {!this.checkQuestionAnswered(v.question_id) && (
                                <span className={styles['chua-hoan-thien']}>Chưa hoàn thiện</span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                  {listQuestion && listQuestion === element ? (
                    ''
                  ) : (
                    <div className={`${styles['answer-item']} answer-item`}>
                      <span className={styles['answer-title']}>
                        Trả lời:{' '}
                        <i style={{ color: '#888893', fontSize: '16px' }}>
                          {this.state.title.filter(e => e.group_id === element).length > 0 &&
                            this.getAnswerQuestion(
                              !this.state[`question-number-${element}`]
                                ? this.state.title.filter(e => e.group_id === element)[0]
                                    .question_id
                                : this.state[`question-number-${element}`]
                            )}
                        </i>
                      </span>
                      <Tooltip placement="top" title="Chỉnh sửa">
                        <Icon
                          onClick={() =>
                            this.handleClickEdit(
                              element,
                              !this.state[`question-number-${element}`]
                                ? this.state.title.filter(e => e.group_id === element)[0]
                                    .question_id
                                : this.state[`question-number-${element}`]
                            )
                          }
                          style={{ fontSize: '20px', color: '#0500BE' }}
                          type="edit"
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        <div className={`${styles['form-edit-item']} hoi-dap-ca-nhan`} style={{ padding: '15px' }}>
          <div>
            <Skeleton paragraph={{ rows: 1 }} active />
          </div>
          <div style={{ paddingTop: '45px' }} className="answer-preload">
            <Skeleton title={false} paragraph={{ rows: 1 }} active />
          </div>
        </div>
        <div className={`${styles['form-edit-item']} hoi-dap-ca-nhan`} style={{ padding: '15px' }}>
          <div>
            <Skeleton paragraph={{ rows: 1 }} active />
          </div>
          <div style={{ paddingTop: '45px' }} className="answer-preload">
            <Skeleton title={false} paragraph={{ rows: 1 }} active />
          </div>
        </div>
        <div className={`${styles['form-edit-item']} hoi-dap-ca-nhan`} style={{ padding: '15px' }}>
          <div>
            <Skeleton paragraph={{ rows: 1 }} active />
          </div>
          <div style={{ paddingTop: '45px' }} className="answer-preload">
            <Skeleton title={false} paragraph={{ rows: 1 }} active />
          </div>
        </div>
        <div className={`${styles['form-edit-item']} hoi-dap-ca-nhan`} style={{ padding: '15px' }}>
          <div>
            <Skeleton paragraph={{ rows: 1 }} active />
          </div>
          <div style={{ paddingTop: '45px' }} className="answer-preload">
            <Skeleton title={false} paragraph={{ rows: 1 }} active />
          </div>
        </div>
      </div>
    );
  }
}

export default HoiDapCaNhan;
