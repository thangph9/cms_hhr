/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Redirect } from 'react-router-dom';
import { Icon } from 'antd';
// import {Link} from 'react-router-dom'
import styles from './styles.less';
import FormLogin from './FormLogin';
import FormRegister from './FormRegister';

// eslint-disable-next-line react/no-multi-comp
@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
class Login extends PureComponent {
  state = {
    statusPage: false,
    help: '',
    validateStatus: '',
  };

  componentDidMount() {
    const { location } = this.props;
    if (location.query.ref === '0') {
      this.setState({
        statusPage: false,
      });
    }
    if (location.query.ref === '1') {
      this.setState({
        statusPage: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;

    if (authentication.register !== nextProps.authentication.register) {
      if (nextProps.authentication.register.status === 'ok') {
        nextProps.history.push({ pathname: '/registerresult' });
      }
    }
  }

  handleClickToggleStatus() {
    const { statusPage } = this.state;
    const {
      history,
      location: { pathname },
    } = this.props;
    this.setState(
      {
        statusPage: !statusPage,
      },
      () => {
        if (statusPage === false) {
          history.push({ pathname, search: '?ref=1' });
        } else history.push({ pathname, search: '?ref=0' });
      }
    );
  }

  render() {
    /*
    if (localStorage['antd-pro-authority'] && localStorage.token) {
      return <Redirect to="/home" />;
    }
    */
    const { statusPage } = this.state;

    return (
      <div id="wrapper" style={{ position: 'relative' }} className={styles.homepageRegister}>
        <div
          className={styles['tw3-homepage--abstract'].concat(
            ' ',
            styles['tw3-homepage--abstract--mobile']
          )}
        >
          <div
            className={styles.homepageContainer__content__form.concat(
              ' ',
              styles.registerContainer
            )}
          >
            <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--left'])}>
              <div className={styles['tw3-pane__content']}>
                <div className={styles.logo}>
                  <img
                    alt="img"
                    src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                    height={42}
                  />
                </div>

                <h1
                  style={{ color: '#fff' }}
                  className={styles['h1--step1'].concat(' ', styles.fw500)}
                >
                  Chat với bạn <strong>mới</strong> khắp thế giới.
                </h1>
                <div
                  style={{ background: 'none' }}
                  className={styles['tw3-homepage--abstract--mobile__tabs'].concat(
                    ' ',
                    styles['tw3-tabsHolder']
                  )}
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClickToggleStatus()}
                    className={
                      statusPage === true
                        ? styles['tw3-tab'].concat(
                            ' ',
                            styles.jsHomepageSwitch,
                            ' ',
                            styles.selected
                          )
                        : styles['tw3-tab'].concat(' ', styles.jsHomepageSwitch)
                    }
                  >
                    ĐĂNG KÝ
                  </span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClickToggleStatus()}
                    className={
                      statusPage === false
                        ? styles['tw3-tab'].concat(
                            ' ',
                            styles.jsHomepageSwitch,
                            ' ',
                            styles.selected
                          )
                        : styles['tw3-tab'].concat(' ', styles.jsHomepageSwitch)
                    }
                  >
                    ĐĂNG NHẬP
                  </span>
                </div>
              </div>
            </div>
            <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--right'])}>
              <div className={styles['tw3-pane__content']}>
                <div
                  className={styles.divider.concat(
                    ' ',
                    styles.hor,
                    ' ',
                    styles.full,
                    ' ',
                    styles['mb--default']
                  )}
                >
                  <span>
                    {statusPage === false
                      ? 'Đăng nhập bằng số điện thoại'
                      : 'Đăng ký tài khoản mới'}
                  </span>
                </div>
                {statusPage === false ? (
                  <FormLogin
                    {...this.props}
                    help={this.state.help}
                    validateStatus={this.state.validateStatus}
                  />
                ) : (
                  <FormRegister {...this.props} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles['tw3-homepage--abstract'].concat(
            ' ',
            styles['tw3-homepage--abstract--desktop']
          )}
        >
          <div className={styles.homepageLinks.concat(' ', styles['homepageLinks--top'])}>
            <div className={styles['homepageLinks--top__left']}>
              <Icon
                style={{ fontSize: '30px', marginRight: '10px', color: '#fff' }}
                type="facebook"
                theme="filled"
                className="icon-login-page"
              />
              <Icon
                style={{ fontSize: '30px', marginRight: '10px', color: '#fff' }}
                type="instagram"
                theme="filled"
                className="icon-login-page"
              />
            </div>
            <div className={styles['homepageLinks--top__right']}>
              <span
                onClick={() => this.handleClickToggleStatus()}
                className={styles['tw3-button'].concat(
                  ' ',
                  styles['tw3-button--orange'],
                  ' ',
                  styles['tw3-button--rounded'],
                  ' ',
                  styles.loginButton
                )}
                data-page="login"
              >
                {statusPage === false ? 'Đăng ký' : 'Đăng nhập'}
              </span>
            </div>
          </div>
          <div
            className={styles.homepageContainer__content__form.concat(
              ' ',
              styles.registerContainer
            )}
          >
            <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--left'])}>
              <div className={styles['tw3-pane__content']}>
                <div className={styles.logo}>
                  <img
                    alt="img"
                    src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                    height={42}
                  />
                </div>

                <h1
                  style={{ color: '#fff' }}
                  className={styles['h1--step1'].concat(' ', styles.fw500)}
                >
                  Chat với bạn <strong>mới</strong> khắp thế giới.
                </h1>
                <p className={styles['mb--slack']}>
                  Gặp hàng triệu người từ khắp nơi bất kể bạn ở đâu. Chat vui vẻ, kết bạn và tìm một
                  nửa của mình. Bởi vì cuộc đời chính là những người bạn gặp gỡ.
                </p>
              </div>
            </div>
            <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--right'])}>
              <div className={styles['tw3-pane__content']}>
                <div
                  className={styles.divider.concat(
                    ' ',
                    styles.hor,
                    ' ',
                    styles.full,
                    ' ',
                    styles['mb--default']
                  )}
                >
                  <span>
                    {statusPage === false
                      ? 'Đăng nhập bằng số điện thoại'
                      : 'Đăng ký tài khoản mới'}
                  </span>
                </div>
                {statusPage === false ? (
                  <FormLogin {...this.props} />
                ) : (
                  <FormRegister {...this.props} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ background: '#fff', height: 0 }}
          className={styles.homepageLinks.concat(' ', styles['homepageLinks--bottom'])}
        >
          <div className={styles['homepageLinks--bottom__links']}>
            <ul>
              <li>
                <a href="/about">Thông tin</a>
              </li>
              <li>
                <a href="http://www.massivemedia.eu">Việc làm</a>
              </li>
              <li>
                <a href="/download">Ứng dụng</a>
              </li>
              <li>
                <a href="/faq">Hỏi đáp</a>
              </li>
              <li>
                <a href="/about/terms">Đ. khoản &amp; Đ. kiện</a>
              </li>
              <li>
                <a href="/about/privacy">Riêng tư</a>
              </li>
              <li>
                <a href="/about/cookie">Cookie</a>
              </li>
              <li>
                <a href="/about/safety">An toàn</a>
              </li>
              <li>
                <a href="https://www.twoo.com/blog">Blog</a>
              </li>
            </ul>
          </div>
          <div className={styles['homepageLinks--bottom__counter']}>
            <h1 style={{ color: '#fff' }} className={styles.newFontSize}>
              1.821.475.870
            </h1>
            <p style={{ color: '#fff' }}>trò chuyện trên Twoo</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
