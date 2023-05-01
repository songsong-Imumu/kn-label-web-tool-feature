import React, { useState, useRef } from 'react';
import { Card, Input, Collapse, Button } from 'antd';
// import Graph from '../componets/graph';
import Graph from '../componets/Network';
import { getRegulationById, getRegulationPath } from '@/axios';
import './index.less';

const { Panel } = Collapse;

export default function HighFault() {
  const [keyword, setKeyword] = useState(null);
  const [data, setData] = useState({}) as any;
  const [list, setList] = useState([]);
  const [faultId, setfaultId] = useState('');
  const onSearch = v => setKeyword(v);
  const GraphRef = useRef() as any;

  const handleGetRegulationById = id => {
    if (!id) return;
    // const equipmentId = list?.filter(item => item.regulationId == id)[0]?.equipmentIds?.split(',')[0];

    setfaultId(id);

    getRegulationById(id).then(res => {
      setData(res);
    });

    getRegulationPath(id).then(res => {
      GraphRef.current?.onHover(res.nodes, res.links);
    });
  };

  return (
    <div className="m-high-fault">
      <Card title={<Input.Search placeholder="故障查询，如：温度升高" allowClear onSearch={onSearch} style={{ width: 500 }} />}>
        <div className="content">

          <div className='faultlist'>
            <div className='title'>故障列表</div>
            {list.slice(0, 101)
              ?.filter(item => item.name)
              ?.map(item => {
                return <Button size="large" onClick={() => handleGetRegulationById(item.regulationId)} key={item.regulationId}>{item.name}</Button>
              })}
          </div>

          <Graph ref={GraphRef} refresh={false} keyword={keyword} callback={v => setList(v)} faultID={faultId} title="fault" />

          <div className="result">
            <div className="title">搜索结果</div>
            <div>
              {!!data && (
                <div className="regulation">
                  <div>
                    <span>现象</span>：{data.phenomenon || '--'}
                  </div>
                  <div>
                    <span>原因</span>：{data.cause || '--'}
                  </div>
                  <div>
                    <span>解决方案</span>：{data.processingMethods || '--'}
                  </div>
                </div>
              )}
              {/* <Collapse accordion onChange={handleGetRegulationById}>
                {list
                  ?.filter(item => item.name)
                  ?.map((item: any, index) => (
                    <Panel header={item.name} key={item.regulationId}>
                      <div className="regulation">
                        <div>
                          <span>现象</span>：{data.phenomenon || '--'}
                        </div>
                        <div>
                          <span>原因</span>：{data.cause || '--'}
                        </div>
                        <div>
                          <span>解决方案</span>：{data.processingMethods || '--'}
                        </div>
                      </div>
                    </Panel>

                  ))}
              </Collapse> */}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
