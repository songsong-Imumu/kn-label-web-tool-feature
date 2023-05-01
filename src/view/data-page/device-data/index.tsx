import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
// import { useHistory } from 'react-router-dom';
import useFetch from '@/hooks/common/useFetch';
import { getFileData } from '@/axios';
import Table from '../components/common-table';
import AddModal from '../components/modal/add';
import './index.less';

export default function TripleData(props) {
  const { data, dispatch, isLoading: loading } = useFetch(
    getFileData,
    { page: 1, size: Infinity, fileType: 'EQUIPMENT', status: 'NO_CONVERT' },
    false
  );
  useEffect(() => {
    dispatch({ page: 1, size: Infinity, fileType: 'EQUIPMENT', status: 'NO_CONVERT' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="origin-data-page">
      <section className="m-list">
        <div className="u-operation">
          <AddModal accept="xlsx" type="ADD" fileType="EQUIPMENT" refresh={dispatch}>
            <Button type="primary">+ 模板导入</Button>
          </AddModal>
        </div>

        <Table fileType="EQUIPMENT" type="equipment" loading={loading} dataSource={data?.content} refresh={dispatch} />
      </section>
    </div>
  );
}
