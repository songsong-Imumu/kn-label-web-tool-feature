import React from 'react';
import IconSet from '@/components/icon';

// 导出 文件名修改
export default function Export(props) {
  const { url, fileName } = props;

  const download = url => {
    if (!url) {
      throw new Error('Resource URL not provided! You need to provide one');
    }
    const ext = url.substring(url.lastIndexOf('.'));
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.style = 'display: none';

        if (ext && ext.length) a.download = fileName + ext;
        document.body.appendChild(a);
        a.click();
      })
      .catch();
  };
  return (
    <a onClick={() => download(url)}>
      <IconSet type="icon-daochu" /> 导出
    </a>
  );
}
