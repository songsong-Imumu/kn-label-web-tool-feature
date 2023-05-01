import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';

interface DataNode {
  name: string;
  id: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const convertData = (data: Array<any>) => {
  data?.forEach(item => {
    item.title = item.name;
    item.key = item.id;
    if (item.children || item.subEquipments) {
      item.children = item.children || item.subEquipments;
    }
    if (item.children?.length) {
      convertData(item.children);
    }
    return item;
  });

  return data || [];
};

const updateTreeData = (list: DataNode[], id: React.Key, children: DataNode[]): DataNode[] =>
  list.map(node => {
    if (node.id === id && children) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, id, children)
      };
    }
    return node;
  });

export default ({ initTreeData, getEquipmentSubTreeDataFunc, onSelect }) => {
  const [treeData, setTreeData] = useState<any>(null);

  const onLoadData = ({ id, children }: any) =>
    new Promise<void>(resolve => {
      if (children?.length) {
        resolve();
        return;
      }

      getEquipmentSubTreeDataFunc({ pid: id, level: 1 }).then((children: any) => {
        children &&
          children.map(item => {
            item.subEquipments = null;
          });
        setTreeData(pre => updateTreeData(pre, id, children));
        resolve();
      });
    });

  useEffect(() => {
    if (initTreeData) {
      setTreeData(convertData(initTreeData));
    }
  }, [initTreeData]);

  if (!treeData) return null;

  return <Tree loadData={onLoadData} onSelect={onSelect} treeData={convertData(treeData)} titleRender={(item: any) => <span>{item.name}</span>} />;
};
