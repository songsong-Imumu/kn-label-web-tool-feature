import React from 'react';
import { Table, Space, Divider } from 'antd';
import IconSet from '@/components/icon';
import { delFile } from '@/axios';
import { renderSize } from '@/utils/tools';
import UpdateModal from './modal/add';
import Del from './modal/del';
import ViewModal from './modal/view-modal';
import Export from './export';

export default function OriginTable(props) {
  const { loading, refresh, dataSource, fileType, type } = props;

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
      title: '操作',
      width: 340,
      render: (elem: any, row: any, index: number) => {
        return (
          <Space>
            <ViewModal id={row.id} type={type} />
            <Divider type="vertical" />
            {/* 未导入,可进行操作 */}
            {/* {row.regulationStatus !== 'ALREADY_ADD' && <></>} */}

            <UpdateModal fileType={fileType} data={row} type="EDIT" refresh={refresh}>
              <a>
                <IconSet type="icon-bianji" /> 编辑
              </a>
            </UpdateModal>

            <Divider type="vertical" />
            <Del id={row.id} func={delFile} refresh={refresh} />
            <Divider type="vertical" />

            <Export url={row.filePathURL} fileName={row.fileName} />
          </Space>
        );
      }
    }
  ];

  // 实体类型
  fileType === 'EQUIPMENT' &&
    columns.splice(1, 0, {
      title: '类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: (text, record) => {
        if (text === 'META_DATA') {
          return '元数据';
        } else {
          return '设备树数据';
        }
      }
    });

  return <Table loading={loading} rowKey="id" dataSource={dataSource} columns={columns} pagination={false} />;
}
