import React from 'react';
import { Popconfirm, notification } from 'antd';
import useFetch from '@/hooks/common/useFetch';

interface Props {
  refresh?: Function;
  func?: Function;
  id: string | number;
}

function AddToTree(props: Props) {
  const { id, func } = props;
  const { dispatch } = useFetch(func, null, false);
  const onAdd = () => {
    dispatch(id).then((data: any) => {
      props.refresh?.();
      if (!data) {
        notification.success({
          message: '添加成功',
          onClick: () => {
            console.log(' Clicked!');
          }
        });
      } else {
        notification.error({
          message: '部分成功',
          description:
            '查看失败数据' +
            (
              <a href={data.data} target="_blank">
                点击下载
              </a>
            ),
          onClick: () => {
            console.log(' Clicked!');
          }
        });
      }
    });
  };

  return (
    <Popconfirm key="2" title="确定构建吗?" okText="确定" cancelText="取消" onConfirm={onAdd}>
      <a>构建</a>
    </Popconfirm>
  );
}

export default AddToTree;
