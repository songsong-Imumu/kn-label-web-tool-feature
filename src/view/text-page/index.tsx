import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/common/useFetch';
import { getTextAll } from '@/axios';
import TextTable from './components/table';
import AddModal from './modal/add';
import './index.less';

var TYPES = {
  rel: 1,
  dic: 0
};

export default function Text(props) {
  const { read, setTextLength } = props;
  const params = useParams() as any;

  const textType = TYPES[params.type];
  const subTitle = textType == 1 ? '关系' : '实体';

  const { data, dispatch: getTextTableData, isLoading: loading } = useFetch(getTextAll, { page: 1, size: Infinity, textType }, false);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [, setSelectedRows] = useState([]);

  useEffect(() => {
    if (setTextLength) {
      setTextLength(selectedKeys?.length || 0);
    }
  }, [selectedKeys, setTextLength]);

  useEffect(() => {
    let textIdss = localStorage
      .getItem('textIds-' + textType)
      ?.split(',')
      .map(item => (item = Number(item)));

    setSelectedKeys(textIdss);

    getTextTableData({ page: 1, size: Infinity, textType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textType]);

  return (
    <div className="text-page">
      <section className="m-list">
        {!read && (
          <div className="u-operation">
            <AddModal type="ADD" textType={textType} subTitle={subTitle} refresh={getTextTableData}>
              <Button type="primary">+ 新增</Button>
            </AddModal>
          </div>
        )}

        <TextTable
          read={read}
          loading={loading}
          subTitle={subTitle}
          textType={textType}
          dataSource={data?.content}
          refresh={getTextTableData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          setSelectedRows={setSelectedRows}
        />
      </section>
    </div>
  );
}
