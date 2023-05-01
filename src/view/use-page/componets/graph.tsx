import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts';
import { message } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { debounce } from '@/utils/tools';
import { getTripleSearchData, getEquipmentPath, getRegulationPath } from '@/axios';

const config = {
  CAUSE: '原因',
  EQUIPMENT: '设备',
  PHENOMENON: '现象',
  PROCESSING_METHODS: '处理方法',
  FAULT: '故障'
};

const Graph = React.forwardRef((props: any, ref) => {
  const { refresh, keyword, callback, func = getTripleSearchData } = props;
  const [data, setData] = useState(null);

  const { dispatch: dispatchGetRegulationPath } = useFetch(getRegulationPath, null, false);
  const { dispatch: dispatchGetEquipmentPath } = useFetch(getEquipmentPath, null, false);

  const echartsRef = useRef<HTMLDivElement>(null);
  const myChartRef = useRef() as any;

  const getOption = graph => {
    if (!graph.categories) return {};

    graph.categories = graph.categories.map(function(a) {
      a.name = config[a.name];
      return a;
    });

    const categories = graph.categories.map(function(a) {
      return a.name;
    });

    return {
      title: {
        text: ''
      },
      focusNodeAdjacency: true,
      tooltip: {
        //内边距
        enterable: true,
        padding: [20, 16, 20, 16],
        //params 传入进来的每个类目数据及echarts属性，ticket异步的类目名称，callback回调函数
        formatter(params, ticket, callback) {
          //自定义模板
          var arr = params.name.split('。').join('\r\n');
          let html = `<div style="min-width: 200px; white-space:pre; max-width: 500px; max-height: 300px; overflow-y:scroll; " ><span style="margin-right:10%; width: 100%; white-space: pre-wrap; ">${params.value ||
            arr}</span></div>`;
          return html;
        }
      },
      legend: [
        {
          // selectedMode: 'single',
          data: categories
        }
      ],
      animationDuration: 1500,

      series: [
        {
          name: '',
          type: 'graph',
          layout: 'force',
          legendHoverLink: true, //是否启用图例 hover(悬停) 时的联动高亮。
          hoverAnimation: true, //是否开启鼠标悬停节点的显示动画
          data: graph.nodes.map((item, index) => {
            return {
              ...item,
              id: item.id + '',
              category: categories.findIndex(_ => _ == config[item.entityType])
            };
          }),

          links: graph.links.map((item, index) => {
            item.value = item.targetName + '>' + item.sourceName;
            item.lineStyle = {
              opacity: 0.3,
              color: '#333',
              curveness: 0.3
            };
            return item;
          }),

          categories: graph.categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            width: 5,
            height: 5,
            formatter: params => {
              if (params.data.entityType == 'EQUIPMENT' && params.data.type === 'xxx') {
                if (params.data.name.length > 4) {
                  return params.data.name.substring(0, 3) + '..';
                }
                return params.data.name;
              } else {
                return '';
              }
            }
          }
          // emphasis: {
          //   focus: 'adjacency',
          //   lineStyle: {
          //     color: 'red',
          //     width: 10
          //   }
          // }
        }
      ]
    };
  };

  // 生成新节点
  const generateNewNodes = (a, b) => {
    return a.map(v => {
      if (b.filter(r => r.id == v.id).length) {
        v.type = 'xxx';
        v.itemStyle = {
          opacity: 1
        };
      } else {
        v.itemStyle = {
          opacity: 0.3
        };
      }
      return v;
    });
  };

  const refreshNodes = a => {
    return a.map(v => {
      v.itemStyle = {
        opacity: 1
      };
      v.type = null;
      return v;
    });
  };

  // 生成新links
  const generateNewLinks = (a, b) => {
    return a.map(v => {
      if (b.filter(r => v.source == r.source && v.target == r.target).length) {
        v.lineStyle = {
          opacity: 1,
          width: 1,
          color: 'red'
        };
      } else {
        v.lineStyle = {
          opacity: 0.3
        };
      }
      return v;
    });
  };

  const refreshLink = a => {
    return a.map(v => {
      v.lineStyle = {
        opacity: 0.3,
        width: 0.3,
        color: '#333'
      };
      return v;
    });
  };

  // 暴露给外部使用
  const onHover = (nodes, links) => {
    const options = myChartRef.current?.getOption();
    const series = options.series[0];
    if (series) {
      // console.log(findIntersectionIndex(series.data, nodes));
      // 查找nodes
      let newNodes = generateNewNodes(series.data, nodes);
      let newLinks = generateNewLinks(series.links, links);

      // myChartRef.current.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: [0],
      //   dataIndex: findIntersectionIndex(series.data, ids)
      // });
      myChartRef.current.setOption({
        ...options,
        series: [
          {
            ...series,
            label: {
              ...series.label,
              show: true
            },
            data: newNodes,
            links: newLinks
          }
        ]
      });
    }
  };

  const getPath = data => {
    const { regulationId, entityType, equipmentId } = data.data;
    if (data.dataType === 'node') {
      if (entityType === 'EQUIPMENT') {
        dispatchGetEquipmentPath(equipmentId).then(res => {
          onHover(res.nodes, res.links);
        });
      } else {
        dispatchGetRegulationPath(regulationId).then(res => {
          onHover(res.nodes, res.links);
        });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    onHover
  }));

  useEffect(() => {
    if (data && echartsRef.current) {
      myChartRef.current = echarts.init(echartsRef.current);
      var option = getOption(data);
      myChartRef.current.setOption(option);
      myChartRef.current?.resize();

      myChartRef.current.on('mouseover', params => getPath(params));

      myChartRef.current.on('mouseout', params => {
        const options = myChartRef.current?.getOption();
        const series = options.series[0];
        if (series) {
          let newNodes = refreshNodes(series.data);
          let newLinks = refreshLink(series.links);
          myChartRef.current.setOption({ ...options, series: [{ ...series, data: newNodes, links: newLinks }] });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, myChartRef]);

  useEffect(() => {
    if (refresh) {
      func({ keyword, pageSize: keyword ? 5 : 100 }).then((res: any) => {
        callback?.(res.searchRes);
        setData(res.tree || res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    func({ keyword, pageSize: keyword ? 5 : 100 }).then((res: any) => {
      callback?.(res.searchRes);
      setData(res.tree || res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  return (
    <div
      ref={echartsRef}
      style={{
        flex: 1,
        padding: 12,
        border: '1px solid #f1f1f',
        height: `calc(100vh - 100px)`
      }}
    />
  );
});

export default Graph;
