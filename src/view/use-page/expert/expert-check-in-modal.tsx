import React from 'react';
import { Button, Form, Input, message } from 'antd';
import Modal from '@/components/common/u-modal';
import IconSet from '@/components/icon';
import { postRegulation } from '@/axios';

export default function RgCheckInModal(props) {
  const { refresh } = props;
  const [form] = Form.useForm();

  const fetch = () => {
    return form.validateFields().then(values => {
      values.equipmentCode = values.equipmentCode?.split('\n');

      postRegulation(values).then(res => {
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
    <Modal
      width={600}
      title="人工录入"
      triggerDom={
        <Button type="primary">
          <IconSet type="icon-manual" />
          人工录入
        </Button>
      }
      onOk={fetch}
    >
      <Form form={form} {...formItemLayout} scrollToFirstError>
        <Form.Item label="资产编码" name="equipmentCode" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入资产编码，如：DA02；若多个资产编码换行输入..." maxLength={1000} />
        </Form.Item>

        <Form.Item label="故障" name="errorName" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>

        <Form.Item label="现象" name="phenomenon" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>
        <Form.Item label="原因" name="cause" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>
        <Form.Item label="处理方法" name="processingMethods" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
