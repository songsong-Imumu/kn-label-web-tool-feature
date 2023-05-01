import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { getTextByKey } from '@/axios';
import UDrawer from '@/components/common/u-drawer';
import useFetch from '@/hooks/common/useFetch';
import { PaginationProps } from '@/interface';
import Table from './module/table-list';
import ModalAdd from '../text-data';
import { TemplateSearchParams } from './interface';
import './index.less';

function View(props) {
  const { textsName, id: textId, refresh, textType, subTitle } = props;
  const DEFAULT_PARAM = {
    page: 1,
    size: 10,
    textType
  };

  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    total: 1
  });

  const [templateList, setTemplateList] = useState();
  const [params, setParams] = useState<Partial<TemplateSearchParams>>(DEFAULT_PARAM);

  const { dispatch: fetchTemplateList, isLoading } = useFetch(getTextByKey, params, false);

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
    textId && getList({ textId });
  };

  //   const handleAddToTree = () => {
  //     postTextAddToTree({ ids: selectedKeys.join(','), equipmentId }).then;
  //   };

  return (
    <div>
      <UDrawer
        callback={refresh}
        trigger={<a>{textsName}</a>}
        title={'查看' + textsName + '详情'}
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
            {textType == 0 && (
              <ModalAdd refresh={getList} subTitle={subTitle} textType={textType} data={{ textId }}>
                <Button type="primary">+ 增加语料数据</Button>
              </ModalAdd>
            )}
          </div>

          <Table
            loading={isLoading}
            list={templateList}
            textId={textId}
            textType={textType}
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            refresh={getList}
            pagination={pagination}
          />
        </div>
      </UDrawer>
    </div>
  );
}

export default View;
