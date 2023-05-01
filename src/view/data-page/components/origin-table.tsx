import React from 'react';
import { Table, Space, Divider, Badge, message } from 'antd';
import IconSet from '@/components/icon';
import { delFile, addFromFile } from '@/axios';
import { renderSize } from '@/utils/tools';
import UpdateModal from './modal/add';
import Del from './modal/del';
import RevertDrawer from './modal/revert-drawer';
import Export from './export';

const TEXT = {
  NO_CONVERT: { status: 'warning', name: '未转换' },
  CONVERT_SUCCESS: { status: 'success', name: '转换成功' },
  CONVERTING: { status: 'processing', name: '未转换' },
  CONVERT_FAIL: { status: 'error', name: '转换失败' }
};

export default function OriginTable(props) {
  const { loading, refresh, dataSource } = props;

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName'
    },
    {
      title: '文件类型',
      dataIndex: 'fileExt',
      width: 140,
      key: 'fileExt'
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 140,
      render: (text, record) => renderSize(text || 0)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (text, record) => {
        const _ = TEXT[text];
        return <Badge status={_.status} text={_.name} />;
      }
    },
    {
      title: '操作',
      width: 360,
      render: (elem: any, row: any, index: number) => {
        const { status } = elem;
        return (
          <Space>
            <UpdateModal data={row} type="EDIT" refresh={refresh}>
              <a>
                <IconSet type="icon-bianji" /> 编辑
              </a>
            </UpdateModal>

            {status === 'CONVERT_SUCCESS' && (
              <>
                <Divider type="vertical" />
                <RevertDrawer id={row.id} />
              </>
            )}
            <Divider type="vertical" />
            <Del id={row.id} func={delFile} refresh={refresh} />

            <Divider type="vertical" />
            <Export url={row.filePathURL} fileName={row.fileName} />
          </Space>
        );
      }
    }
  ];
  return <Table loading={loading} rowKey="id" dataSource={dataSource} columns={columns} pagination={false} />;
}
