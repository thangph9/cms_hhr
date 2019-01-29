import React from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './index.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/home">
      <Button size="large" type="primary">
        Về trang chủ
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => (
  <Result
    className={styles.registerResult}
    type="success"
    title={<div className={styles.title}>Tài khoản được đăng ký thành công</div>}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
