import React, { useEffect, useState } from 'react';
import { Form, Input, message, Button, Alert } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import Modal from '@/components/common/u-modal';
import Tree from './eq-tree';
import { postTextAddToTree, getEquipmentSubTreeData, getEquipmentSubData } from '@/axios';

/**
 * 新增子设备
 * @param props
 * @returns
 */
export default function AddTreeModal(props) {
  const { refresh, selectedKeys } = props;
  const [nodeName, setNodeName] = useState('');
  const [form] = Form.useForm();
  const { data } = useFetch(getEquipmentSubData, { pid: 0, level: 1 }); // 整数
  const { dispatch: getEquipmentSubTreeDataFunc } = useFetch(getEquipmentSubTreeData, null, false);

  const handleOk = () => {
    return form.validateFields().then(values => {
      postTextAddToTree(values).then(res => {
        message.success('操作成功');
        refresh && refresh();
      });
    });
  };

  const onSelect = (v, node) => {
    setNodeName(node?.node?.name);
    form.setFieldsValue({ equipmentId: v });
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
  useEffect(() => {
    if (selectedKeys) {
      form.setFieldsValue({ ids: selectedKeys.join(',') });
    }
    return () => {
      form.resetFields();
    };
  }, [form, selectedKeys]);
  return (
    <Modal
      width={600}
      bodyStyle={{ maxHeight: 500, overflowY: 'scroll' }}
      title="添加到设备树"
      triggerDom={
        <Button type="primary" disabled={!selectedKeys?.length}>
          + 添加到设备树
        </Button>
      }
      onOk={handleOk}
    >
      <Form form={form} {...formItemLayout} scrollToFirstError initialValues={{ ids: selectedKeys?.join(',') }}>
        <Alert style={{ marginBottom: '20px' }} message={`已选择设备：${nodeName || '--'}`} type="success" />

        <Form.Item label="设备" name="ids">
          <Input.TextArea placeholder="请输入" maxLength={1000} disabled />
        </Form.Item>

        <Form.Item label="选择设备">
          <Tree onSelect={onSelect} getEquipmentSubTreeDataFunc={getEquipmentSubTreeDataFunc} initTreeData={data} />
        </Form.Item>
        <Form.Item label="设备编码" hidden name="equipmentId" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" disabled maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
