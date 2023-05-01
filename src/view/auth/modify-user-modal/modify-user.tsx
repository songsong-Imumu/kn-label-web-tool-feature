import React from 'react';
import { Form, Modal, message, Select, Input } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { putUser } from '@/axios';
import { roleList } from '../index';

interface Props {
  data?: Record<string, any>;
  type: 'ADD' | 'EDIT';
  onCancel: () => void;
  refresh: () => void;
}

const AddTreeModal = (props: Props) => {
  const [form] = Form.useForm();
  const { data, onCancel, refresh, type } = props;
  const { dispatch: dispathPutUser } = useFetch(putUser, null, false); // 设备

  const title = type === 'EDIT' ? '编辑' : '新增';

  const fetch = (values: any) => {
    form.validateFields().then(values => {
      dispathPutUser({ ...values }).then(res => {
        message.success('操作成功');
        onCancel && onCancel();
        refresh && refresh();
      });
    });
  };

  return (
    <Modal title={title} visible onOk={fetch} onCancel={onCancel}>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} initialValues={{ ...data }} scrollToFirstError>
        <Form.Item label="id" name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="姓名" name="trueName">
          <Input disabled />
        </Form.Item>

        <Form.Item label="角色" name="roleType">
          <Select placeholder="请选择">
            {roleList.map(item => (
              <Select.Option value={item.roleType} key={item.roleType}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTreeModal;
