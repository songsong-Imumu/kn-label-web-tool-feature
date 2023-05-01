import React, { useEffect } from 'react';
import { Button } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { getFileData } from '@/axios';
import Table from '../components/origin-table';
import AddModal from '../components/modal/add';
import './index.less';

export default function OriginData(props) {
  const { data, dispatch, isLoading: loading } = useFetch(getFileData, { page: 1, size: Infinity, fileType: 'ORIGINAL_CORPUS' }, false);

  useEffect(() => {
    dispatch({ page: 1, size: Infinity, fileType: 'ORIGINAL_CORPUS' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="origin-data-page">
      <section className="m-list">
        <div className="u-operation">
          <AddModal type="ADD" refresh={dispatch}>
            <Button type="primary">+ 文件导入</Button>
          </AddModal>
        </div>

        <Table loading={loading} dataSource={data?.content} refresh={dispatch} />
      </section>
    </div>
  );
}
