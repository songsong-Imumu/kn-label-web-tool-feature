import React from 'react';
import { Form, Input, message } from 'antd';
import Modal from '@/components/common/u-modal';
import { postEquipmentAdd } from '@/axios';

/**
 * 新增子设备
 * @param props
 * @returns
 */
export default function AddNodeModal(props) {
  const { refresh, id } = props;
  const [form] = Form.useForm();

  const fetch = () => {
    return form.validateFields().then(values => {
      postEquipmentAdd(values).then(res => {
        message.success('操作成功');
        refresh && refresh();
      });
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };

  return (
    <Modal width={600} title="新增设备" triggerDom={<span>新增子设备</span>} onOk={fetch}>
      <Form form={form} {...formItemLayout} scrollToFirstError initialValues={{ pid: id }}>
        <Form.Item label="设备" name="pid" hidden>
          <Input placeholder="请输入" maxLength={100} />
        </Form.Item>

        <Form.Item label="设备编码" name="code" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={200} />
        </Form.Item>

        <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
