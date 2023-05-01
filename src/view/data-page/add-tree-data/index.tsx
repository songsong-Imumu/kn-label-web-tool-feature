import React, { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import { Button } from 'antd';
import { getParams } from '@/utils/tools';
import useFetch from '@/hooks/common/useFetch';
import { getFileData, addToTree, markTree } from '@/axios';
import AddModal from '../components/add-device-modal';
import Table from './table';
import './index.less';

export default function AddTreeData(props) {
  const { type } = getParams();
  const func = type == 'RELATION_CORPUS' ? addToTree : markTree;
  const { data, dispatch, isLoading: loading } = useFetch(getFileData, { page: 1, size: Infinity, fileType: type, status: 'CONVERT_SUCCESS' }, false);
  const [interval, setInterval] = useState<null | number>(null);

  useInterval(() => {
    type == 'RELATION_CORPUS' && dispatch({ page: 1, size: Infinity, fileType: type, status: 'CONVERT_SUCCESS' });
  }, interval);

  //RELATION_CORPUS
  useEffect(() => {
    dispatch({ page: 1, size: Infinity, fileType: type, status: 'CONVERT_SUCCESS' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    setInterval(10000);
    return () => {
      setInterval(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="add-tree-page">
      <section className="m-list">
        <div className="u-operation">
          <AddModal
            type="ADD"
            fileType={type}
            refresh={() => {
              dispatch({ page: 1, size: Infinity, fileType: type, status: 'CONVERT_SUCCESS' });
            }}
          >
            <Button type="primary">+ 新增</Button>
          </AddModal>
        </div>
        <Table func={func} fileType={type} loading={loading} dataSource={data?.content} refresh={dispatch} />
      </section>
    </div>
  );
}
