import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import IconSet from '@/components/icon';
import Drawer from '@/components/common/u-drawer';
import { getFileById, updateFileContent } from '@/axios';
import './index.less';

const RevertDrawer = props => {
  const { id, title, trigger } = props;
  const [fileExt, setFileExt] = useState('');
  const [url, setUrl] = useState(null);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');

  const onsubmit = () => {
    updateFileContent({ id, content }).then(res => {
      message.success('操作成功！');
      setVisible(false);
    });
  };

  const beforeShow = () => {
    return getFileById(id).then(res => {
      setFileExt(res.fileExt);
      setUrl(res.pdfPath || res.filePathURL); // 增加pdf 用户处理word情况
      setContent(res.content);
      setVisible(true);
    });
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Drawer
      className="m-revert-drawer"
      title={title || '文字提取'}
      visible={visible}
      maskClosable
      onClose={onClose}
      beforeShow={beforeShow}
      footer={
        <Button onClick={onsubmit} type="primary">
          确定
        </Button>
      }
      width="80vw"
      trigger={
        trigger || (
          <a>
            <IconSet type="icon-fenzu" /> 文字提取
          </a>
        )
      }
    >
      <div className="content">
        <div className="item">
          {['jpg', 'png', 'gif'].includes(fileExt) ? (
            <img src={url} width="100%" height="100%" alt="圖片" />
          ) : (
            <iframe title="文件" src={url} width="100%" frameBorder="none" height="100%" />
          )}
        </div>
        <div className="item">
          <Input.TextArea value={content} onChange={v => setContent(v.target.value)} />
        </div>
      </div>
    </Drawer>
  );
};

export default RevertDrawer;
