import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Layout from '@/components/layout';

function App(props) {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout {...props} />
    </ConfigProvider>
  );
}

export default App;
