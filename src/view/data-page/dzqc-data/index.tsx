import React, { useEffect } from 'react';
import { Button } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { getFileData } from '@/axios';
import Table from '../components/common-table';
import AddModal from '../components/modal/add';
import './index.less';

export default function DzqcData(props) {
  const { dispatch, isLoading: loading } = useFetch(getFileData, { page: 1, size: Infinity, fileType: 'DZQC_CORPUS' }, false);
  const data = {
    content: ''
  }
  // useEffect(() => {
  //   dispatch({ page: 1, size: Infinity, fileType: 'DZQC_CORPUS' });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="origin-data-page">
      <section className="m-list">
        <div className="u-operation">
          <AddModal type="ADD" accept="xlsx" fileType="DZQC_CORPUS" refresh={dispatch}>
            <Button type="primary">+ 模板导入</Button>
          </AddModal>

          {/* <RgCheckInModal refresh={dispatch} fileType="DZQC_CORPUS" /> */}
        </div>

        <Table fileType="DZQC_CORPUS" type="dzqc" loading={loading} dataSource={data?.content} refresh={dispatch} />
      </section>
    </div>
  );
}
