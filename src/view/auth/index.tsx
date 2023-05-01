import React from 'react';
import { Table, Space } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { getUserList } from '@/axios';
import './index.less';
import ModifyUserModal from './modify-user-modal';

export const roleList = [
  { roleType: 1, name: '管理员' },
  { roleType: 3, name: '操作员' }
];
export default function UserPage(props) {
  const { data, dispatch: dispatchGetUserList, isLoading: loading } = useFetch(getUserList, { page: 0, size: Infinity });

  const columns = [
    {
      title: '姓名',
      dataIndex: 'trueName',
      key: 'trueName',
      width: 200
    },
    {
      title: '角色',
      dataIndex: 'roleType',
      key: 'roleType',
      render: (elem: any, row: any, index: number) => {
        return roleList.find(item => item.roleType == elem)?.name;
      }
    },

    {
      title: '操作',
      width: 200,
      render: (elem: any, row: any, index: number) => {
        return (
          <Space>
            <ModifyUserModal
              data={row}
              type="EDIT"
              refresh={() => {
                dispatchGetUserList({ page: 0, size: Infinity });
              }}
            >
              <a>修改角色</a>
            </ModifyUserModal>
          </Space>
        );
      }
    }
  ];
  return (
    <div className="user-page">
      <section className="m-list">
        <Table loading={loading} rowKey="id" dataSource={data?.content} columns={columns} pagination={false} />
      </section>
    </div>
  );
}
