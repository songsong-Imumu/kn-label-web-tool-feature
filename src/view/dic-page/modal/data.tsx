import React, { useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { putDictData, postDictData } from '@/axios';

interface Props {
  data?: Record<string, any>;
  type: 'ADD' | 'EDIT';
  dictType: 0 | 1;
  subTitle?: string;
  onCancel: Function;
  refresh: Function;
}

const ADDModal = (props: Props) => {
  const [form] = Form.useForm();
  const { data, onCancel, refresh, type, dictType, subTitle } = props;
  const { dispatch: addFunc } = useFetch(postDictData, null, false); // 新增
  const { dispatch: updateFunc } = useFetch(putDictData, null, false); // 更新
  const title = (type === 'EDIT' ? '编辑' : '新增') + subTitle + '数据';

  const onSubmit = (values: any) => {
    form.validateFields().then(values => {
      values.alias = values.alias?.split('，');
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

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ alias: (data.alias || []).join('，') });
    }
  }, [data, form]);

  return (
    <Modal form={form} title={title} visible onOk={onSubmit} onCancel={onCancel}>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} initialValues={{ ...data, dictType }} scrollToFirstError>
        <Form.Item hidden label="dictId" name="dictId">
          <Input />
        </Form.Item>
        <Form.Item hidden label="id" name="id">
          <Input />
        </Form.Item>
        <Form.Item hidden label="dictType" name="dictType">
          <Input />
        </Form.Item>

        {dictType == 0 && (
          <>
            <Form.Item rules={[{ required: true, message: '请填写' }]} label="全称" name="name">
              <Input placeholder="全称" maxLength={200} />
            </Form.Item>

            <Form.Item label="别名" name="alias">
              <Input.TextArea placeholder="请输入别名，不同别名间请以“ ，”分割" maxLength={200} />
            </Form.Item>
          </>
        )}

        {dictType == 1 && (
          <>
            <Form.Item rules={[{ required: true, message: '请填写' }]} label="头实体" name="name">
              <Input placeholder="输入头实体" maxLength={200} />
            </Form.Item>

            <Form.Item rules={[{ required: true, message: '请填写' }]} label="尾实体" name="endName">
              <Input placeholder="输入尾实体" maxLength={200} />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ADDModal;
