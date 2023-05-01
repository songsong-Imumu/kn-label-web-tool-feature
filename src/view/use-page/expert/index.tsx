import React, { useState } from 'react';
import { Card, Button, Divider } from 'antd';
// import Graph from '../componets/graph';
import Graph from '../componets/Network';
import AddModal from '@/view/data-page/components/modal/add';
import { getTripleTreeData } from '@/axios';
import ExpertCheckInModal from './expert-check-in-modal';
import './index.less';

export default function HighSearch() {
  const [refresh, setRefresh] = useState<boolean | number>(false);

  return (
    <div className="m-high-expert">
      <Card
        extra={
          <>
            <AddModal type="ADD" fileType="RELATION_CORPUS" refresh={() => setRefresh(Math.random())}>
              <Button type="primary">+ 模板导入</Button>
            </AddModal>
            <Divider type="vertical" />
            <ExpertCheckInModal refresh={() => setRefresh(Math.random())} />
          </>
        }
      >
        <div className="content">
          <Graph refresh={refresh} func={getTripleTreeData} />
        </div>
      </Card>
    </div>
  );
}
