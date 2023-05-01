import React, { useCallback } from 'react';
import { Table, Divider, Space } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import IconSet from '@/components/icon';
import { delDictData } from '@/axios';
import ModalAdd from '../../../dict-data';
import Del from '../../../del';
import './index.less';

function TableList(props) {
  const { dictType, subTitle, entityType } = props;
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
      type: [0]
    },

    {
      title: '头实体',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      type: [1]
    },

    {
      title: '尾实体',
      dataIndex: 'endName',
      key: 'endName',
      ellipsis: true,
      width: '40%',
      type: [1]
    },

    {
      title: '设备编码',
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
      ellipsis: true,
      type: [entityType === 'EQUIPMENT' ? 0 : -1],
      render: text => text || '--'
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
      type: [0, 1],
      render: (text, record) => (
        <Space>
          <ModalAdd type="EDIT" dictType={dictType} subTitle={subTitle} data={record} refresh={props.getList}>
            <a>
              <IconSet type="icon-bianji" /> 编辑
            </a>
          </ModalAdd>
          <Divider type="vertical" />
          <Del dictType={dictType} id={record.id} func={delDictData} refresh={props.getList} />
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: props.selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      props.setSelectedKeys(selectedRowKeys as number[]);
      props.setSelectedCodes?.(selectedRows.map(item => item.code));
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
      props.getList(tempParams);
    },
    [props]
  );

  return (
    <div className="u-table-list">
      <Table
        loading={props.loading}
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={props.list}
        columns={columns.filter(item => item.type.includes(dictType))}
        onChange={handleTableChange}
        tableLayout="fixed"
        pagination={{ current: props.pagination.page + 1, total: props.pagination.total, showQuickJumper: true, showSizeChanger: true }}
      />
    </div>
  );
}

export default TableList;
