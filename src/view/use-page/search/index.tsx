import React, { useState, useEffect } from 'react';
import { Card, Input, Collapse, Row, Col } from 'antd';
import { getTripleTreeData } from '@/axios';
import useFetch from '@/hooks/common/useFetch';
import TreeWithContextMenu from '@/view/data-page/components/tree/TreeWithContextMenu';
// import Graph from '../componets/graph';
import Graph from '../componets/Network';
import { config } from './config';

import { getEquipmentSubData, getEquipmentTreeData, getEquipmentSubTreeData, deleteTree } from '@/axios';
import './index.less';

const { Panel } = Collapse;

export default function HighSearch() {
  const [keyword, setKeyword] = useState(null);
  const [list, setList] = useState();
  const [treeId,setTreeId] = useState();
  const { dispatch: dispatchSearch } = useFetch(getEquipmentTreeData);
  const { dispatch } = useFetch(getEquipmentSubData);
  const { dispatch: getEquipmentSubTreeDataFunc } = useFetch(getEquipmentSubTreeData, null, false);
  const [value, setValue] = useState<string>('');
  const [treeGraphData, setTreeGraphData] = useState([]);
  const [data, setData] = useState([]);

  const onSearch = v => {
    setKeyword(v);
  };

  const onSelect = (v: any, node: any) => {
    setTreeId(v[0])
    console.log(v)
    getEquipmentSubTreeDataFunc({ level: 0, pid: v }).then(res => {
      setTreeGraphData([{ ...node.node, children: res }]);
    });
  };

  useEffect(() => {
    getEquipmentSubTreeDataFunc({ pid: 0, level: 1 }).then(res => {
      setTreeGraphData(res);
    });

    dispatch({ pid: 0, level: 1 }).then(res => setData(res));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-high-graph-page">
      <Card title={<Input.Search placeholder="智能查询，如：磨煤机" allowClear onSearch={onSearch} style={{ width: 400 }} />}>
        <div className="content">
          <div className="treelist">
            <div className="title">设备树列表</div>
            <TreeWithContextMenu
              onSelect={onSelect}
              getEquipmentSubTreeDataFunc={getEquipmentSubTreeDataFunc}
              initTreeData={data}
              // refresh={() => dispatch(value)}
            ></TreeWithContextMenu>
          </div>

          <Graph func={getTripleTreeData} refresh={false} keyword={keyword} callback={v => setList(v)} treeHighlight={treeId} title="search" />

          {!!list && (
            <div className="result">
              <div className="title">搜索结果</div>
              <div>
                <Collapse accordion>
                  {list?.map((item, index) => {
                    return (
                      <Panel header={item.sheetName} key={index}>
                        {item.data.map(i => (
                          <Row>
                            {i.map(j => (
                              <Col span={6}>{j}</Col>
                            ))}
                          </Row>
                        ))}
                      </Panel>
                    );
                  })}
                </Collapse>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
