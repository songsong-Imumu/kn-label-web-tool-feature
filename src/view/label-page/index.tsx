import React, { useState } from 'react';
import { Table, Space, Divider, Form, Input, Button } from 'antd';
import { useRequest } from 'ahooks';
import FormSearch from '@/components/form-search';
import { getLabelList } from '@/axios';
import './index.less';

const layOut = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default function LabelPage() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<Record<string, any>>({}); // 全部搜索项参数

  const getTableData = ({ current, size }) => {
    const params = {
      page: current,
      size,
      ...searchParams
    };
    return getLabelList(params);
  };
  const { tableProps, refresh } = useRequest(getTableData, {
    paginated: true,
    defaultsize: 10,
    formatResult: (response: any) => {
      return {
        list: response || [],
        total: 100
      };
    },
    refreshDeps: [searchParams]
  });

  const onSearch = () => {
    setSearchParams(form.getFieldsValue());
  };

  const onReset = () => {
    form.resetFields();
    setSearchParams({});
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 240
    },
    {
      title: '快捷键',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 140
    },
    {
      title: '操作',
      width: 140,
      render: (elem: any, row: any, index: number) => {
        return (
          <Space size="10">
            编辑
            <Divider type="vertical" />
            删除
          </Space>
        );
      }
    }
  ];

  return (
    <div className="m-label-page">
      <FormSearch mode="common" form={form} onSearch={onSearch} onReset={onReset} {...layOut}>
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
      </FormSearch>
      <section className="m-list">
        <div className="u-operation">新增</div>
        <Table {...tableProps} refresh={refresh} columns={columns} pagination={{ ...tableProps.pagination, sizeOptions: ['20', '30', '50'] }} />
      </section>
    </div>
  );
}
