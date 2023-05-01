import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { useInterval } from 'ahooks';
import { GlobalContext } from '@/context';
import useFetch from '@/hooks/common/useFetch';
import { postTrainModel, getCurrentRate, getHistoryRates } from '@/axios';

const { Option } = Select;
/**
 *
 * @returns 模型训练
 */
export default function TrainingModel(props) {
  const { textType } = props;
  const { refreshState } = useContext(GlobalContext);
  const { dispatch: dispatchPostTrainModel, isLoading } = useFetch(postTrainModel, { page: 1, textType, size: Infinity }, false);
  const { data: currentRateData, dispatch: dispatchGetCurrentRate } = useFetch(getCurrentRate, { textType });
  const { data: historyRateData, dispatch: dispatchGetHistoryRates } = useFetch(getHistoryRates, { textType });
  const [interval, setInterval] = useState<null | number>(null);

  useInterval(() => {
    refreshState();
    dispatchGetCurrentRate({ textType });
    dispatchGetHistoryRates({ textType });
  }, interval);

  const onFinish = values => {
    console.log('训练');
    var dictIds = localStorage
      .getItem('dictIds-' + textType)
      ?.split(',')
      .map(item => (item = Number(item)));
    var textIds = localStorage
      .getItem('textIds-' + textType)
      ?.split(',')
      .map(item => (item = Number(item)));

    dispatchPostTrainModel({ ...values, textIds, dictIds, textType }).then(res => {
      message.success('训练成功');
      setInterval(3000);
    });
  };

  const getCurrentRateOption = data => {
    if (!data) return {};
    return {
      title: { text: '当前训练准确率 %' },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value',
        min: 80
      },
      color: '#7cb305',
      grid: {
        show: true,
        gridIndex: 1
      },
      legend: {
        show: true
      },
      tooltip: {
        show: true
      },
      series: [
        {
          data: data.map(item => (item = item.toFixed(2))),
          type: 'line'
        }
      ]
    };
  };

  const getHistoryRateOption = data => {
    if (!data) return {};
    return {
      title: { text: '历史训练准确率 %' },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          interval: 1
        }
      },
      yAxis: {
        type: 'value',
        min: 80
      },
      grid: {
        show: true
      },
      color: '#9254de',
      legend: {
        show: true
      },
      tooltip: {
        show: true
      },
      series: [
        {
          data: data.map(item => (item = item.rate.toFixed(2))),
          type: 'line'
        }
      ]
    };
  };

  useEffect(() => {
    return () => {
      setInterval(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-training-model">
      <section className="u-form">
        <Form name="basic" initialValues={{ model: 'BiLSTM' }} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} onFinish={onFinish}>
          <Form.Item label="模型" name="model" style={{ width: 300 }} rules={[{ required: true, message: '请输入' }]}>
            <Select>
              <Option value="BiLSTM">BiLSTM</Option>
            </Select>
          </Form.Item>
          <Form.Item label="训练数量" name="clusterCount">
            <Input />
          </Form.Item>

          <Form.Item label="输入维度" name="vectorScale">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              训练
            </Button>
          </Form.Item>
        </Form>
      </section>

      <section className="u-view">
        <div className="u-view-left">
          <ReactEcharts option={getCurrentRateOption(currentRateData)} />
          <div>迭代次数</div>
        </div>
        <div className="u-view-right">
          <ReactEcharts option={getHistoryRateOption(historyRateData)} />
          <div>训练序号</div>
        </div>
      </section>
    </div>
  );
}
