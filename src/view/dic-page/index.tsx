import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/common/useFetch';
import { getDicAll, getActiveDic } from '@/axios';
import Dictable from './components/table';
import AddModal from './modal/add';
import './index.less';

var TYPES = {
  rel: 1,
  dic: 0
};

export default function Dictionary(props) {
  const { read, setDicLength, type } = props;
  const params = useParams() as any;

  const dictType = TYPES[params.type];
  const subTitle = dictType == 1 ? '关系' : '实体';
  const { dispatch: getDicTableData, isLoading } = useFetch(getDicAll, { page: 1, size: Infinity, dictType }, false);
  const { dispatch: getActiveDicTableData } = useFetch(getActiveDic, { page: 1, size: Infinity, dictType }, false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const refresh = () => {
    getDicTableData({ page: 1, size: Infinity, dictType }).then(res => {
      setDataSource(res.content);
    });
  };

  useEffect(() => {
    if (setDicLength) {
      setDicLength(selectedKeys?.length || 0);
    }
  }, [selectedKeys, setDicLength]);

  useEffect(() => {
    if (type === 'tag') {
      // 预览模式
      getActiveDicTableData({ dictType }).then(res => {
        setDataSource(res);
      });
    } else {
      getDicTableData({ page: 1, size: Infinity, dictType }).then(res => {
        let dictIdss = localStorage
          .getItem('dictIds-' + dictType)
          ?.split(',')
          .map(item => (item = Number(item)));
        setDataSource(res.content);
        setSelectedKeys(dictIdss);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictType]);
  return (
    <div className="dic-page">
      <section className="m-list">
        {!read && (
          <div className="u-operation">
            <AddModal type="ADD" dictType={dictType} subTitle={subTitle} refresh={refresh}>
              <Button type="primary">+ 新增</Button>
            </AddModal>
          </div>
        )}

        <Dictable
          model={type} // 预览模式
          read={read}
          subTitle={subTitle}
          dictType={dictType}
          loading={isLoading}
          dataSource={dataSource}
          refresh={refresh}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      </section>
    </div>
  );
}
