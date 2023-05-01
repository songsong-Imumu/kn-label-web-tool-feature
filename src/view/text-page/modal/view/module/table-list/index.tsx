import React, { useCallback } from 'react';
import { Table, Divider, Space } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import IconSet from '@/components/icon';
import { delTextData } from '@/axios';
import { TemplateTableProps } from './interface';
import ModalAdd from '../../../text-data';
import Del from '../../../del';
import './index.less';

function TableList(props: TemplateTableProps) {
  const { refresh, textType } = props;
  const columns = [
    {
      title: '语料',
      dataIndex: 'text',
      key: 'text',
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
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '200px',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <ModalAdd isEdit type="EDIT" data={record} textType={textType} refresh={refresh}>
            <a>
              <IconSet type="icon-bianji" /> 编辑
            </a>
          </ModalAdd>
          <Divider type="vertical" />
          <Del id={record.id} textType={textType} func={delTextData} refresh={refresh} />
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: props.selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      props.setSelectedKeys(selectedRowKeys as number[]);
      props?.setSelectedCodes?.(selectedRows.map(item => item.code));
    },
    getCheckboxProps: record => ({
      id: record.id + ''
    })
  };

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const tempParams = {
        size: pagination.pageSize,
        page: pagination.current
      };
      refresh(tempParams);
    },
    [refresh]
  );

  return (
    <div className="u-table-list">
      <Table
        loading={props.loading}
        rowKey="id"
        columns={columns}
        rowSelection={rowSelection}
        dataSource={props.list}
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{ current: props.pagination.page + 1, total: props.pagination.total, showQuickJumper: true, showSizeChanger: true }}
      />
    </div>
  );
}

export default TableList;
