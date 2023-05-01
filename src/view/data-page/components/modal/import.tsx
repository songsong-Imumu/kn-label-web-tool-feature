import React, { useEffect } from 'react';
import { Form, Input, Modal, message, Select } from 'antd';
import Upload from '@/components/upload/SelfUpload';
import useFetch from '@/hooks/common/useFetch';
import { getFileById, fileUpload, updateFileName, updateFileContent, tripleAdd, equipmentAdd } from '@/axios';

interface Props {
  data?: Record<string, any>;
  type: 'ADD' | 'EDIT';
  fileType?: 'ORIGINAL_CORPUS' | 'TXT_CORPUS' | 'ENTITY_CORPUS' | 'RELATION_CORPUS' | 'EQUIPMENT';
  onCancel: Function;
  refresh: Function;
  accept?: string;
}

const URL = {
  ENTITY_CORPUS: '/api/fileInfo/download/%E4%B8%89%E5%85%83%E7%BB%84%E6%A8%A1%E6%9D%BF.xlsx',
  RELATION_CORPUS: '/api/fileInfo/download/%E4%B8%89%E5%85%83%E7%BB%84%E6%A8%A1%E6%9D%BF.xlsx',
  EQUIPMENT: '/api/fileInfo/download/%E8%AE%BE%E5%A4%87%E6%A0%91%E6%A8%A1%E6%9D%BF.xlsx'
};

const ADDModal = (props: Props) => {
  const [form] = Form.useForm();
  const { data, onCancel, accept = 'doc,docx,txt,pdf,png,jpg,jpeg,xlsx,xls,7z,zip,rar', refresh, type, fileType = 'ORIGINAL_CORPUS' } = props;
  const { dispatch: updateFunc } = useFetch(updateFileName, null, false); // 更新
  const { dispatch: updateFileContentFunc } = useFetch(updateFileContent, null, false); // 更新
  const { dispatch: addFunc } = useFetch(fileUpload, null, false); // 新增
  const { dispatch: tripleAddFunc } = useFetch(tripleAdd, null, false); // 导入三元组
  const { dispatch: equipmentAddFunc } = useFetch(equipmentAdd, null, false); // 导入设备
  const title = type === 'EDIT' ? '编辑' : '新增';

  const fetch = async () => {
    form.validateFields().then(values => {
      // values.filePath = values.filePath?.length ? values.filePath[0]?.response.data.id : undefined;
      if (type == 'EDIT') {
        if (fileType === 'TXT_CORPUS') {
          // 可修改文件内容
          updateFileContentFunc({ ...values }).then(res => {
            message.success('操作成功');
            onCancel && onCancel();
            refresh && refresh();
          });
        } else {
          // 只允许修改名字
          updateFunc({ ...values }).then(res => {
            message.success('操作成功');
            onCancel && onCancel();
            refresh && refresh();
          });
        }
      }

      values.filePath?.map(item => {
        let filePath = item?.response.data.id;
        if (type === 'ADD') {
          if (fileType === 'EQUIPMENT') {
            equipmentAddFunc({ ...values, filePath: null, id: filePath }).then(res => {
              message.success('操作成功');
              onCancel && onCancel();
              refresh && refresh();
            });
          } else if (fileType === 'RELATION_CORPUS') {
            tripleAddFunc({ ...values, filePath: null, id: filePath }).then(res => {
              message.success('操作成功');
              onCancel && onCancel();
              refresh && refresh();
            });
          } else {
            addFunc({ ...values, filePath: null, id: filePath }).then(res => {
              message.success('操作成功');
              onCancel && onCancel();
              refresh && refresh();
            });
          }
        }
      });
    });
  };

  useEffect(() => {
    if (data?.id && fileType === 'TXT_CORPUS') {
      getFileById(data.id).then(res => {
        form.setFieldsValue({ content: res.content, ...data, fileType });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fileType]);

  return (
    <Modal width={800} title={title} visible onOk={fetch} onCancel={onCancel}>
      <Form form={form} labelCol={{ span: 6 }} initialValues={{ ...data, fileType }} wrapperCol={{ span: 16 }} scrollToFirstError>
        {type == 'ADD' && ['ENTITY_CORPUS', 'RELATION_CORPUS', 'EQUIPMENT'].includes(fileType) && (
          <Form.Item label="模板下载">
            <a href={URL[fileType]} target="_blank">
              结构化数据模板
            </a>
          </Form.Item>
        )}

        <Form.Item hidden label="id" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item hidden label="fileType" name="fileType">
          <Input disabled />
        </Form.Item>

        {'EQUIPMENT' === fileType && (
          <Form.Item label="类型" name="equipmentType">
            <Select placeholder="请选择">
              {[
                { name: '元数据', value: 'META_DATA' },
                { name: '设备树数据', value: 'DATA' }
              ].map(item => (
                <Select.Option value={item.value} key={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {type == 'EDIT' && (
          <Form.Item label="文件名称" name="fileName" rules={[{ required: true, message: '请填写' }]}>
            <Input placeholder="请输入" maxLength={200} />
          </Form.Item>
        )}

        {type == 'EDIT' && fileType == 'TXT_CORPUS' && (
          <Form.Item label="内容" name="content" rules={[{ required: true, message: '请填写' }]}>
            <Input.TextArea placeholder="请输入" maxLength={20000} rows={10} />
          </Form.Item>
        )}

        {type == 'ADD' && (
          <Form.Item label="文件" name="filePath" valuePropName="fileList">
            <Upload multiple action="/api/fileInfo/upload" maxCount="10" accept={accept} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ADDModal;
