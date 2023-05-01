import React, { useEffect } from 'react';
import { Button } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { getFileData } from '@/axios';
import Table from '../components/common-table';
import AddModal from '../components/modal/add';
import './index.less';

export default function ToolData(props) {
  const { data, dispatch, isLoading: loading } = useFetch(getFileData, { page: 1, size: Infinity, fileType: 'ENTITY_CORPUS' }, false);

  useEffect(() => {
    dispatch({ page: 1, size: Infinity, fileType: 'ENTITY_CORPUS' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="origin-data-page">
      <section className="m-list">
        <div className="u-operation">
          <AddModal type="ADD" accept="xlsx" fileType="ENTITY_CORPUS" refresh={dispatch}>
            <Button type="primary">+ 模板导入</Button>
          </AddModal>

          {/* <RgCheckInModal refresh={dispatch} fileType="ENTITY_CORPUS" /> */}
        </div>

        <Table fileType="ENTITY_CORPUS" type="entity" loading={loading} dataSource={data?.content} refresh={dispatch} />
      </section>
    </div>
  );
}
