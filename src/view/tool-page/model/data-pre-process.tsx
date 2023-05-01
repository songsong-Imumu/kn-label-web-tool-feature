import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Select, Slider, Tabs, message, notification, Spin } from 'antd';
import { useInterval } from 'ahooks';
import { ScatterContext, GlobalContext } from '@/context';
import useFetch from '@/hooks/common/useFetch';
import Table from '../components/table-list/index';
import WordsCloudEchart from '../components/word-cloud-echart';
import ScatterEchart from '../components/scatter-echart';
import { setClusterAndVector, getPreSample, getScatter } from '@/axios';

const { Option } = Select;
const { TabPane } = Tabs;

/**
 *
 * @returns 数据预处理
 */
export default function DataPreProcess(props) {
  const { textType } = props;
  const { refreshState } = useContext(GlobalContext);
  const [activeKey, setActiveKey] = useState('1');
  const [interval, setInterval] = useState(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [clusterId, setClusterId] = useState(-1);
  const [sampleState, setSampleState] = useState(false);
  const [tranningLoading, setTranningLoading] = useState(false);
  const { dispatch: dispatchSetClusterAndVector, isLoading: loading } = useFetch(setClusterAndVector, { page: 1, size: Infinity }, false);
  const { dispatch: dispatchGetPreSample } = useFetch(getPreSample, null, false);
  const { data: scatterData, dispatch: dispatchGetScatter } = useFetch(getScatter, { textType });

  const onChangeTabs = v => {
    setActiveKey(v);
  };

  useInterval(() => {
    refreshState(res => {
      if (res && res.status == 11) {
        message.success('聚类成功！');
        setTranningLoading(false);
        dispatchGetScatter({ textType }); // 获取散点图
        setInterval(null);
      }
    });
  }, interval);

  /**
   * 聚类并向量化
   */
  const onTranning = values => {
    dispatchSetClusterAndVector({
      ...values,
      textType,
      dictIds: localStorage.getItem('dictIds-' + textType)?.split(','),
      textIds: localStorage.getItem('textIds-' + textType)?.split(',')
    }).then(res => {
      notification.success({
        message: '操作成功',
        description: '开始聚类，成功后可执行采样'
      });
      setTranningLoading(true);
      setInterval(3000);
    });
  };

  /**
   * 采样
   */
  const onSample = () => {
    if (sliderValue) {
      dispatchGetPreSample({ rate: sliderValue / 100, textType }).then(res => {
        localStorage.setItem('labelState', 'pre');
        setSampleState(true);
        message.success('采样成功');
      });
    }
  };

  const updateCluster = id => {
    setClusterId(id);
  };

  useEffect(() => {
    if (scatterData?.length) {
      setClusterId(scatterData[0].clusterId);
    }
  }, [scatterData]);

  return (
    <div className="m-data-pre-process">
      <Form
        name="basic"
        className="u-form"
        initialValues={{ model: 'dec2Vec', method: 'Kmeans' }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onTranning}
      >
        {/* <Form.Item label="向量化方法" name="model" rules={[{ required: true, message: '请输入' }]}>
                    <Select>
                        <Option value="dec2Vec">dec2Vec</Option>
                    </Select>
                </Form.Item> */}
        <Form.Item label="向量维度" name="vectorScale" rules={[{ required: true, message: '请输入' }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item label="聚类方法" name="method">
                    <Select>
                        <Option value="Kmeans">Kmeans</Option>
                    </Select>
                </Form.Item> */}

        <Form.Item label="聚类类数" name="clusterCount" rules={[{ required: true, message: '请输入' }]}>
          <Input />
        </Form.Item>

        <div className="f-0">
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              聚类
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Spin tip="聚类中..." spinning={tranningLoading}>
        <section className="u-sample">
          <div className="u-sample-content">
            <span>采样率：</span>
            <Slider min={1} max={100} value={sliderValue} onChange={v => setSliderValue(v)} />
            <span>{sliderValue} %</span>
          </div>
          <Button type="primary" onClick={onSample}>
            采样
          </Button>

          {sampleState && (
            <Button type="primary" onClick={() => refreshState()}>
              执行打标
            </Button>
          )}
        </section>
        <section className="u-result">
          <Tabs defaultActiveKey={activeKey} onChange={onChangeTabs}>
            <TabPane tab="数据可视化" key="1" className="u-result-view">
              <div>
                <ScatterContext.Provider value={{ updateCluster }}>
                  {clusterId > -1 && <ScatterEchart data={scatterData} />}
                  {clusterId > -1 && <WordsCloudEchart clusterId={clusterId} textType={textType} />}
                </ScatterContext.Provider>
              </div>
            </TabPane>
            {/* <TabPane tab="匹配情况" key="2">
              <Table textType={textType} />
            </TabPane> */}
          </Tabs>
        </section>
      </Spin>
    </div>
  );
}
