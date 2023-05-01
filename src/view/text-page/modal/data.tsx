import React from 'react';
import { Form, Input, Modal, message } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { putTextData, postTextData } from '@/axios';

interface Props {
  data?: Record<string, any>;
  type: 'ADD' | 'EDIT';
  textType: 0 | 1;
  onCancel: Function;
  refresh: Function;
}

const ADDModal = (props: Props) => {
  const [form] = Form.useForm();
  const { data, onCancel, refresh, type, textType } = props;
  const { dispatch: addFunc } = useFetch(postTextData, null, false); // 新增
  const { dispatch: updateFunc } = useFetch(putTextData, null, false); // 更新
  const title = type === 'EDIT' ? '编辑数据' : '新增数据';

  const onSubmit = (values: any) => {
    form.validateFields().then(values => {
      values.id
        ? updateFunc(values).then(res => {
            message.success('操作成功');
            onCancel && onCancel();
            refresh && refresh();
          })
        : addFunc(values).then(res => {
            message.success('操作成功');
            onCancel && onCancel();
            refresh && refresh();
          });
    });
  };

  return (
    <Modal form={form} title={title} visible onOk={onSubmit} onCancel={onCancel}>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} initialValues={{ ...data, textType }} scrollToFirstError>
        <Form.Item hidden label="textId" name="textId">
          <Input />
        </Form.Item>

        <Form.Item hidden label="dictId" name="dictId">
          <Input />
        </Form.Item>

        <Form.Item hidden label="id" name="id">
          <Input />
        </Form.Item>

        <Form.Item rules={[{ required: true, message: '请填写' }]} label="全称" name="text">
          <Input.TextArea placeholder="全称" maxLength={5000} rows={8} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ADDModal;
