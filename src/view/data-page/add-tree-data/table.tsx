import React from 'react';
import { Table, Tag, Divider } from 'antd';
import Del from '../components/modal/del';
import { delFile } from '@/axios';
import { renderSize } from '@/utils/tools';
import AddTree from './addTree';

export default function AddTreeTable(props) {
  const { loading, dataSource, refresh, func } = props;

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName'
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
      dataIndex: 'regulationStatus',
      key: 'regulationStatus',
      width: 140,
      render: (text, record) => {
        if (record.regulationStatus == 'ALREADY_ADD') {
          return <Tag color="#87d068">已构建</Tag>;
        } else if (record.regulationStatus == 'WAIT_ADD') {
          return <Tag color="#f50">未构建</Tag>;
        } else if (record.regulationStatus == 'BUILD_FAILED') {
          return <span>不可构建</span>;
        } else if (record.regulationStatus == 'BUILDING') {
          return <span>构建中...</span>;
        } else {
          return <span>--</span>;
        }
      }
    },
    {
      title: '操作',
      width: 240,
      render: (elem: any, record: any, index: number) => {
        return (
          <>
            <Del id={record.id} func={delFile} refresh={refresh} />
            <Divider type="vertical" />
            {record.regulationStatus == 'WAIT_ADD' && <AddTree {...record} func={func} refresh={refresh} />}
          </>
        );
      }
    }
  ];

  return <Table loading={loading} rowKey="id" dataSource={dataSource} columns={columns} pagination={false} />;
}
