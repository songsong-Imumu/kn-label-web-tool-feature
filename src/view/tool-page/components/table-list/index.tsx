import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import { useInterval } from 'ahooks';
import { getSampleData } from '@/axios';
import useFetch from '@/hooks/common/useFetch';
import './index.less';

function TableList(props) {
  const { type, shouldUpdate, textType } = props;
  const [interval, setInterval] = useState<null | number>(null);

  const DEFAULT_PARAM = {
    type: type || 'model', // model—模型抽样 pre—预处理抽样
    page: 1,
    textType,
    size: 10
  };

  const columns = [
    {
      title: '语料',
      dataIndex: 'text',
      key: 'text'
    },
    {
      title: '识别结果',
      dataIndex: 'textMark',
      key: 'textMark',
      render: (text, record) => {
        return (
          <>
            <div dangerouslySetInnerHTML={{ __html: text || record.text }} />
            {!!record.relations?.length &&
              record.relations.map(item => (
                <div className="u-desc" style={{ color: item.color }}>
                  <span className="title">头实体: </span>
                  {item.headEntity}； <span className="title">尾实体: </span>
                  {item.tailEntity}；<span className="title">关系: </span> {item.dictName}
                </div>
              ))}
          </>
        );
      }
    }
  ];

  const [pagination, setPagination] = useState({
    page: 1,
    total: 1
  });

  const [list, setList] = useState([]);

  const [params, setParams] = useState(DEFAULT_PARAM);

  const { dispatch: fetchTemplateList, isLoading } = useFetch(getSampleData, params, false);

  const getList = useCallback(
    (search: {}) => {
      const tempParams = Object.assign({}, params, { page: 1 }, search);
      setParams(tempParams); // 记录上一次搜索记录
      fetchTemplateList(tempParams).then(res => {
        setList(res.content);
        setPagination({ page: tempParams.page, total: res.totalElements }); // 记录分页器参数
      });
    },
    [fetchTemplateList, params]
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const tempParams = {
      size: pagination.pageSize,
      page: pagination.current
    };
    getList(tempParams);
  };

  useInterval(() => {
    getList({});
  }, interval);

  useEffect(() => {
    getList({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldUpdate) {
      // 识别成功后，查询列表
      setInterval(5000);
    }

    return () => {
      setInterval(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldUpdate]);

  return (
    <div className="u-table-list">
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={list}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{ current: pagination.page, total: pagination.total, showQuickJumper: true, showSizeChanger: true }}
      />
    </div>
  );
}

export default TableList;
