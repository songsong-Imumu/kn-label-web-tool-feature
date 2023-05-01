import React from 'react';
import { Popconfirm, message } from 'antd';
import useFetch from '@/hooks/common/useFetch';

interface Props {
  id: string | number;
  func: (req: any) => Promise<unknown>;
  callback?: Function;
}

function Del(props: Props) {
  const { func, id, callback } = props;
  const { dispatch: dispatchDeleteApp } = useFetch(func, null, false);
  const onDel = () => {
    dispatchDeleteApp(id).then((data: any) => {
      callback?.(id);
      message.success('删除成功');
    });
  };

  return (
    <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={onDel}>
      <a>删除</a>
    </Popconfirm>
  );
}

export default Del;
