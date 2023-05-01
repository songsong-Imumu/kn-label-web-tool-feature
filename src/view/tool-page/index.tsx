import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Popconfirm, message } from 'antd';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '@/context';
import useFetch from '@/hooks/common/useFetch';
import { getToolState, resetCurrent, resetAll } from '@/axios';
import Loading from './model/loading';
import DataImport from './model/data-import'; // 数据导入
import DataPreProcess from './model/data-pre-process'; // 数据预处理
import ManualNamed from './model/manual-named'; // 手工标注
import TextRecognition from './model/text-recognise'; // 识别
import TrainingModel from './model/training-model'; // 训练
import DataExport from './components/data-export'; // 导出
import './index.less';

const stop = {
  0: 0,
  1: 128,
  2: '100%',
  3: '100%',
  4: '100%'
};

const StatusName = {
  10: '聚类中',
  12: '聚类失败',
  13: '预采样完成',
  20: '打标完成',
  21: '打标中',
  30: '训练完成',
  31: '训练中',
  32: '训练失败'
};

var TYPES = {
  rel: 1,
  dic: 0
};

const formatStatus = (status, step) => {
  const _status = Math.floor((status || 0) / 10);
  // 可以进行下一项
  const next = step == _status || ((step == _status + 1 || (_status == 1 && step == 4) || (_status == 4 && step == 2)) && (status || 0) % 10 == 0);
  return {
    status: _status,
    next
  };
};

export default function ToolPage() {
  const params = useParams() as any;
  const textType = TYPES[params.type];

  // 流程操作
  const OP_BTNS = [
    {
      name: '加载数据/字典',
      type: 0,
      top: 0,
      stopArea: 0
    },
    {
      name: '数据预处理',
      type: 1,
      top: 58 * 2
    },
    {
      name: '手工标注',
      type: 2,
      top: 58 * 3 + 59
    },
    {
      name: '训练模型',
      type: 3,
      top: 58 * 5 + 60
    },
    {
      name: '语料识别',
      type: 4,
      top: 58 * 7 + 61
    },
    {
      name: <DataExport textType={textType} />,
      type: 5,
      top: 58 * 9 + 62,
      status: true // 当前模块不渲染
    }
  ];

  const renderdom = ({ step }) => {
    const element = {
      '-1': <Loading />,
      0: <DataImport textType={textType} />,
      1: <DataPreProcess textType={textType} />,
      2: <ManualNamed textType={textType} />,
      3: <TrainingModel textType={textType} />,
      4: <TextRecognition textType={textType} />,
      5: null
    };
    return element[step];
  };

  const { dispatch } = useFetch(getToolState, { textType }, false);
  const { dispatch: dispatchResetCurrent } = useFetch(resetCurrent, null, false);
  const { dispatch: dispatchResetAll } = useFetch(resetAll, null, false);
  const [count, setCount] = useState({ step: -1, active: false });
  const [statusInfo, setStatuInfo] = useState('未开始');

  // 状态跳转
  const goto = (data: any, step?: number) => {
    const { status, next } = formatStatus(data, step);
    if (!step && step != 0) {
      // 默认跳转
      setCount({ step: status, active: true });
      return false;
    } // 默认值
    setCount({ step, active: next });
  };

  const _setStatusInfo = (status, msg) => {
    setStatuInfo(StatusName[status] || msg);
  };

  // 开始流程
  const _select = (step: number, status: boolean) => {
    if (status) return;
    dispatch().then((res: any) => {
      _setStatusInfo(res.status, res.msg);
      goto(res.status, step);
    });
  };

  // 更新流程状态
  const refreshState = (callback?: Function) => {
    dispatch().then((res: any) => {
      goto(res.status);
      _setStatusInfo(res.status, res.msg);

      callback && callback(res);
    });
  };

  // 存储字典
  const dispatchDict = v => {
    if (!v) {
      localStorage.removeItem('dictIds-' + textType);
    } else {
      localStorage.setItem('dictIds-' + textType, v?.join(','));
    }
  };

  const dispatchText = v => {
    if (!v) {
      localStorage.removeItem('textIds-' + textType);
    } else {
      localStorage.setItem('textIds-' + textType, v?.join(','));
    }
  };

  // 重置当前
  const _resetCurrent = v => {
    dispatchResetCurrent(textType).then(res => {
      message.success('操作成功');
      refreshState();
    });
  };

  // 重置所有
  const _resetAll = v => {
    dispatchResetAll(textType).then(res => {
      message.success('操作成功');
      refreshState();
    });
  };

  useEffect(() => {
    if (dispatch) {
      dispatch().then((res: any) => {
        if (res.status == 0) {
          // 初始化设置
          dispatchDict(res.dictIds);
          dispatchText(res.textIds);
        }
        goto(res.status);
        _setStatusInfo(res.status, res.msg);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, textType]);

  return (
    <GlobalContext.Provider
      value={{
        dispatchDict,
        dispatchText,
        refreshState
      }}
    >
      <div className="m-tool-page">
        <Card
          className="left-panel"
          title={
            <>
              流程状态: <Tag color="#f5222d">{statusInfo}</Tag>
            </>
          }
          extra={
            <>
              <Popconfirm title="重置本轮" onConfirm={_resetCurrent} okText="确定" cancelText="取消">
                <Button type="primary">重置本轮</Button>
              </Popconfirm>
              <Popconfirm title="重置所有?" onConfirm={_resetAll} okText="确定" cancelText="取消">
                <Button>重置所有</Button>
              </Popconfirm>
            </>
          }
        >
          <div className="content">
            {OP_BTNS.map(item => (
              <span
                className={`item ${count.step == item.type ? 'active' : ''}`}
                style={{
                  top: item.top
                }}
                onClick={() => _select(item.type, item.status)}
              >
                {item.name}
              </span>
            ))}
          </div>
        </Card>
        <section className="right-panel">
          {renderdom(count)}
          <div className={`${count.active ? 'current' : 'not-allowed'}`} style={{ height: stop[count.step] }} />
        </section>
      </div>
    </GlobalContext.Provider>
  );
}
