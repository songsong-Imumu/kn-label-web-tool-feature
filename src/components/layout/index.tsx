import React, { useState } from 'react';
import { Layout } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import HeaderCustom from '@/components/header';
import ContentCustom from '@/components/content';
import SiderCustom from '@/components/sider';
import { getUserInfo } from '@/axios';

function App(props) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: userInfo } = useFetch(getUserInfo, null);

  return (
    <Layout>
      <HeaderCustom userInfo={userInfo} />
      <Layout className="g-layout">
        <SiderCustom setCollapsed={(params: boolean) => setCollapsed(params)} />
        <ContentCustom collapsed={collapsed} auth={{ user: userInfo }} />
      </Layout>
    </Layout>
  );
}

export default App;
