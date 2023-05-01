import React, { useEffect } from 'react';
import { Divider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import './index.less';

function Header(props: any) {
  const { userInfo = {} } = props;
  const { trueName, roleType } = userInfo;

  const onLogout = () => {
    localStorage.removeItem('trueName');
    localStorage.removeItem('roleType');
    location.href = '/api/logout';
  };

  useEffect(() => {
    localStorage.setItem('trueName', trueName);
    localStorage.setItem('roleType', roleType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <nav className="g-header-nav">
      <div className="g-header-nav-logo" />
      <div className="g-header-nav-title">电厂关键设备知识图谱</div>
      <div className="g-header-nav-login">
        <span className="avatar">Hi，{trueName || '--'}</span>
        <Divider type="vertical" />
        <a onClick={onLogout}>
          <LogoutOutlined />
          退出登录
        </a>
      </div>
    </nav>
  );
}

export default withRouter(Header);
