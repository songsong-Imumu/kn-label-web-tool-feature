import React, { useEffect, useRef } from 'react';
// then import echarts modules those you have used manually.
import * as echarts from 'echarts';
import 'echarts/lib/component/tooltip';

import 'echarts/lib/component/title';

export default function TreeGraph(props) {
  const { data } = props;
  const echartsRef = useRef(null);
  const getOption = graph => {
    return {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      animationDuration: 1500,
      series: [
        {
          name: '设备树',
          type: 'tree',
          height: 600,
          top: 0,
          right: '20%',
          data: graph,
          position: 'top',
          symbolSize: 6,
          lineStyle: {
            color: '#00446B'
          },
          roam: true,
          label: {
            height: 24,
            padding: 4,
            lineHeight: 24,
            borderWidth: 0.5, // 边框宽度
            borderRadius: 20, // 边框圆角
            borderColor: '#FFF', // 文字块的边框色
            backgroundColor: '#00446B',
            position: 'left',
            verticalAlign: 'middle',
            align: 'left',
            color: '#fff',
            fontSize: 12
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
  };

  const convertData = (data: Array<any>) => {
    data?.forEach(item => {
      item.title = item.name;
      item.key = item.id;
      item.children = item.children || item.subEquipments || [];
      if (item.children.length) {
        convertData(item.children);
      }
    });
    return data || [];
  };

  useEffect(() => {
    if (data) {
      var myChart = echarts.init(echartsRef.current);
      var option = getOption(convertData(data));
      myChart.setOption(option);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      ref={echartsRef}
      style={{
        flex: 2,
        padding: 12,
        border: '1px solid #f1f1f',
        minHeight: '600px'
      }}
    />
  );
}
