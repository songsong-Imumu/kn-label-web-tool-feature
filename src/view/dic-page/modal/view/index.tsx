import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { getDicByKey } from '@/axios';
import UDrawer from '@/components/common/u-drawer';
import useFetch from '@/hooks/common/useFetch';
import { PaginationProps } from '@/interface';
import Table from './module/table-list';
import ModalAdd from '../dict-data';
import AddTreeModal from '../view/add-tree-modal';
import { TemplateSearchParams } from './interface';
import './index.less';

function Template(props) {
  const { dictionaryName, entityType, id: dictId, refresh, dictType, subTitle } = props;
  const DEFAULT_PARAM = {
    page: 1,
    size: 10
  };

  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    total: 1
  });

  const [templateList, setTemplateList] = useState();
  const [params, setParams] = useState<Partial<TemplateSearchParams>>(DEFAULT_PARAM);

  const { dispatch: fetchTemplateList, isLoading } = useFetch(getDicByKey, params, false);

  const getList = useCallback(
    (search: Partial<TemplateSearchParams> = {}) => {
      const tempParams = Object.assign({}, params, { page: 1 }, search);
      setParams(tempParams); // 记录上一次搜索记录

      fetchTemplateList(tempParams).then(res => {
        setSelectedKeys([]); // 清空所选列
        setTemplateList(res.content);
        setPagination({ page: tempParams.page, total: res.totalElements }); // 记录分页器参数
      });
    },
    [fetchTemplateList, params]
  );

  const beforeShow = () => {
    dictId && getList({ dictId });
  };

  return (
    <>
      <UDrawer
        callback={refresh}
        trigger={<a>{dictionaryName}</a>}
        title={'查看' + dictionaryName + '详情'}
        beforeShow={beforeShow}
        className="m-template"
        width={document.body.clientWidth * 0.8}
        mask
        maskStyle={{
          width: '100%'
        }}
      >
        <div className="u-table">
          <div className="u-opera-row">
            <ModalAdd refresh={getList} dictType={dictType} subTitle={subTitle} data={{ dictId }}>
              <Button type="primary">+ 增加字典</Button>
            </ModalAdd>
            {entityType === 'EQUIPMENT' && <AddTreeModal selectedKeys={selectedKeys} refresh={getList} />}
          </div>

          <Table
            entityType={entityType}
            loading={isLoading}
            list={templateList}
            dictType={dictType}
            subTitle={subTitle}
            dictId={dictId}
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            getList={getList}
            pagination={pagination}
          />
        </div>
      </UDrawer>
    </>
  );
}

export default Template;
