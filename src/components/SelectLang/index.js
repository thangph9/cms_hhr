import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const { className } = this.props;
    const selectedLang = getLocale();
    const locales = ['vi-VN', 'en-US', 'zh-CN', 'zh-TW', 'pt-BR'];
    const languageLabels = {
      'vi-VN': 'Tiếng Việt',
      'en-US': 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁体中文',
      'pt-BR': 'Português',
    };
    const languageIcons = {
      'vi-VN': '🇻🇳',
      'en-US': '🇬🇧',
      'zh-CN': '🇨🇳',
      'zh-TW': '🇭🇰',
      'pt-BR': '🇧🇷',
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)}>
          <Icon type="global" title={formatMessage({ id: 'navBar.lang' })} />
        </span>
      </HeaderDropdown>
    );
  }
}
