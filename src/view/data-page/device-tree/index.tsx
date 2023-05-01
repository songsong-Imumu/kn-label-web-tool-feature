import React, { useState, useEffect } from 'react';
import { Spin, Input, Button, Modal, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import useFetch from '@/hooks/common/useFetch';
import TreeWithContextMenu from '../components/tree/TreeWithContextMenu';
import TreeGarph from '../components/tree/tree-graph';

import { getEquipmentSubData, getEquipmentTreeData, getEquipmentSubTreeData, deleteTree } from '@/axios';
import './index.less';

const { confirm } = Modal;
export default function DeviceTree(props) {
  const { dispatch: dispatchSearch } = useFetch(getEquipmentTreeData);
  const { dispatch } = useFetch(getEquipmentSubData);
  const { dispatch: getEquipmentSubTreeDataFunc } = useFetch(getEquipmentSubTreeData, null, false);
  const [value, setValue] = useState<string>('');
  const [treeGraphData, setTreeGraphData] = useState([]);
  const [data, setData] = useState([]);

  const onSearch = () => {
    if (value) {
      dispatchSearch({ keyword: value }).then(res => setData(res));
    }
  };

  const showConfirm = () => {
    confirm({
      title: '确定清空图谱数据吗？',
      icon: <ExclamationCircleFilled />,
      onOk: () => {
        deleteTree().then(res => {
          setData([]); // 数据清空
          setTreeGraphData([]); // 数据清空
          message.success('操作成功');
        });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const onSelect = (v: any, node: any) => {
    getEquipmentSubTreeDataFunc({ level: 0, pid: v }).then(res => {
      setTreeGraphData([{ ...node.node, children: res }]);
    });
  };

  useEffect(() => {
    // dispathcGetOptions({ pid: 0 }).then(res => {
    //   // res.map(item => {
    //   //   item.isLeaf = false;
    //   //   return item;
    //   // });
    //   setOptions(res);
    // });

    getEquipmentSubTreeDataFunc({ pid: 0, level: 1 }).then(res => {
      setTreeGraphData(res);
    });

    dispatch({ pid: 0, level: 1 }).then(res => setData(res));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="device-tree-page">
      <div className="title">设备树</div>
      <div className="search">
        <Input.Search
          placeholder="设备模糊搜索"
          value={value}
          onChange={v => setValue(v.target.value)}
          allowClear
          onSearch={onSearch}
          style={{ width: 400 }}
        />

        <Button onClick={showConfirm} style={{ marginLeft: 40 }}>
          清空设备树
        </Button>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <TreeWithContextMenu
            onSelect={onSelect}
            getEquipmentSubTreeDataFunc={getEquipmentSubTreeDataFunc}
            initTreeData={data}
            refresh={() => dispatch(value)}
          />
        </div>
        <TreeGarph data={treeGraphData} />
      </div>
    </div>
  );
}
