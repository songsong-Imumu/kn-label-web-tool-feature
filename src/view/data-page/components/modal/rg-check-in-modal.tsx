import React from 'react';
import { Button, Form, Input, message, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '@/components/common/u-modal';
import IconSet from '@/components/icon';
import { manualImport } from '@/axios';

export default function RgCheckInModal(props) {
  const { refresh, fileType } = props;
  const [form] = Form.useForm();

  const fetch = () => {
    return form.validateFields().then(values => {
      manualImport(values).then(res => {
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
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
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
        <Form.Item label="文件名称" name="fileName" rules={[{ required: true, message: '请填写' }]}>
          <Input placeholder="请输入" maxLength={100} />
        </Form.Item>

        <Form.Item label="内容" name="content" rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" maxLength={20000} />
        </Form.Item>

        {fileType === 'ENTITY_CORPUS' && (
          <Form.List name="entitys">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '实体类容' : ''}
                    rules={[{ required: true, message: '必填' }]}
                  >
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item {...restField} name={[name, 'content']} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="请输入实体内容" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'type']} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="请输入实体类型" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ width: '40' }} />
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    增加实体内容
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}

        {fileType === 'RELATION_CORPUS' && (
          <Form.List name="relations">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '三元组' : ''}
                    rules={[{ required: true, message: '必填' }]}
                  >
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item {...restField} name={[name, 'head']} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="请输入头实体" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'tail']} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="请输入尾实体" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'relation']} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="请输入关系" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    增加三元组
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Modal>
  );
}
