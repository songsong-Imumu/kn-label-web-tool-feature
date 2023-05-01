import React, { useEffect, useCallback, useState } from 'react';
import { Form, Input, Modal, message, Select } from 'antd';
import { ChromePicker } from 'react-color';
import Upload from '@/components/upload/SelfUpload';
import useFetch from '@/hooks/common/useFetch';
import { postDic, updateDic, getFileData } from '@/axios';

interface Props {
  data?: Record<string, any>;
  type: 'ADD' | 'EDIT';
  dictType: 1 | 0;
  subTitle: string;
  onCancel: Function;
  refresh: Function;
}

const popover = {
  position: 'absolute',
  zIndex: '2'
};
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px'
};

const OptionsList = [
  {
    name: '故障',
    value: 'FAULT'
  },
  {
    name: '现象',
    value: 'PHENOMENON'
  },
  {
    name: '原因',
    value: 'CAUSE'
  },
  {
    name: '处理方法',
    value: 'PROCESSING_METHODS'
  },
  {
    name: '设备',
    value: 'EQUIPMENT'
  }
];

const ADDModal = (props: Props) => {
  const [form] = Form.useForm();
  const { data, onCancel, refresh, type, subTitle, dictType } = props;
  const [focus, setFocus] = useState(false);
  const [showChromePicker, setShowChromePicker] = useState(false);
  const [color, setColor] = useState('#fff');
  const { dispatch: updateFunc } = useFetch(updateDic, null, false); // 更新
  const { dispatch: addFunc } = useFetch(postDic, null, false); // 新增
  const title = (type === 'EDIT' ? '编辑' : '新增') + subTitle;
  // const fileType = { '0': 'TXT_CORPUS', '1': 'RELATION_CORPUS' }[dictType];
  // const { data: fileList } = useFetch(getFileData, { page: 1, size: Infinity, fileType });

  const fetch = (values: any) => {
    form.validateFields().then(values => {
      values.filePath = values.filePath?.length ? values.filePath[0].response.data : undefined;
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

  const triggleChromePicker = () => {
    setShowChromePicker(true);
  };

  const handleClose = () => {
    setShowChromePicker(false);
  };

  const handleChromePicker = color => {
    setColor(color.hex);
    form.setFieldsValue({ color: color.hex });
  };

  const handleUserKeyPress = useCallback(
    event => {
      const { key, keyCode, ctrlKey, altKey, shiftKey } = event;
      if (focus && (keyCode === 32 || (keyCode >= 65 && keyCode <= 90))) {
        let active = ctrlKey ? 'ctrl + ' : '';
        active = (altKey ? 'alt + ' : '') + active;
        active = (shiftKey ? 'shift + ' : '') + active;
        active = active + key;

        let activeCode = ctrlKey ? '018' : '';
        activeCode = (altKey ? '019' : '') + activeCode;
        activeCode = (shiftKey ? '017' : '') + activeCode;
        activeCode = activeCode + '0' + keyCode;
        form.setFieldsValue({ keyName: active });
        form.setFieldsValue({ keyCode: activeCode });
      }
    },
    [focus, form]
  );

  useEffect(() => {
    window.addEventListener('keyup', handleUserKeyPress);
    return () => {
      window.removeEventListener('keyup', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(() => {
    if (data) {
      setColor(data.color);
    }
  }, [data]);

  return (
    <Modal title={title} visible onOk={fetch} onCancel={onCancel}>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} initialValues={{ ...data, dictType }} scrollToFirstError>
        <Form.Item hidden label="id" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item hidden label="dictType" name="dictType">
          <Input disabled />
        </Form.Item>

        <Form.Item hidden label="color" name="color">
          <Input disabled />
        </Form.Item>

        <Form.Item rules={[{ required: true, message: '请填写' }]} label={subTitle + '名称'} name="dictionaryName">
          <Input placeholder="请输入" maxLength={200} />
        </Form.Item>

        <Form.Item rules={[{ required: true, message: '请填写' }]} label={subTitle + '描述'} name="dictionaryDescribe">
          <Input.TextArea placeholder="请输入" maxLength={2000} />
        </Form.Item>

        <Form.Item label="类型" name="entityType">
          <Select>
            {OptionsList.map(item => (
              <Select.Option key={item.value}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="标签颜色">
          <div style={{ border: '1px solid #e8e8e8', height: '32px', width: '100%', background: color }} onClick={triggleChromePicker} />
          {showChromePicker && (
            <div style={popover}>
              <div style={cover} onClick={handleClose} />
              <ChromePicker color={color} onChange={handleChromePicker} />
            </div>
          )}
        </Form.Item>

        <Form.Item label="标签快捷键" name="keyName" rules={[{ required: true, message: '请填写' }]}>
          <Input placeholder="例如： ctrl + a" maxLength={200} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
        </Form.Item>

        <Form.Item label="keyCode" name="keyCode" hidden>
          <Input placeholder="请输入" />
        </Form.Item>

        {type !== 'EDIT' && (
          <Form.Item label="文件" name="filePath" valuePropName="fileList">
            <Upload maxCount="1" accept="xls,xlsx,txt" />
          </Form.Item>
        )}

        {/* <Form.Item label="文件" name="fileId">
          <Select placeholder="请选择">
            {fileList?.content?.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.fileName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ADDModal;
