import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { getTripleSearchData, getEquipmentPath, getRegulationPath, getTripleTreeData } from '@/axios';

const config = {
  CAUSE: '原因',
  EQUIPMENT: '设备',
  PHENOMENON: '现象',
  PROCESSING_METHODS: '处理方法',
  FAULT: '故障'
};

const Graph = React.forwardRef((props: any, ref) => {
  const { refresh, keyword, callback, func = getTripleSearchData, treeHighlight, faultID, title } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (data) {
      if ('nodes' in data) {
        console.log(data);
        drawNetwork(data, keyword);
      }
    }
  }, [data]);

  useEffect(() => {
    if (refresh) {
      func({ keyword, pageSize: keyword ? 5 : 100 }).then((res: any) => {
        drawNetwork(res, keyword);
        callback?.(res.searchRes);
        setData(res.tree || res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    func({ keyword, pageSize: keyword ? 5 : 100 }).then((res: any) => {
      // drawNetwork(res, keyword);
      callback?.(res.searchRes);
      setData(res.tree || res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  // 设备树列表treeHighlight更新后，在网络图中高亮
  // useEffect(() => {
  //   // 悬浮在点上获取到达根节点的路径和节点集
  //   // let filterEdges = (edges, d) => {
  //   //   let filterEdges = []
  //   //   let filterNodes = [d]
  //   //   //  若点的类型是故障，则需要找到 现象，处理方法，原因节点，以及对应的路径
  //   //   if (d.entityType === 'FAULT') {
  //   //     filterEdges = edges.filter(e => e.target === d);
  //   //     for (let i = 0; i < filterEdges.length; i++) {
  //   //       filterNodes.push(filterEdges[i].source)
  //   //     }
  //   //   }
  //   //   // 找到设备到根节点的路径以及节点
  //   //   while (d.name !== '滨海电厂') {
  //   //     let edge = edges.filter(e => e.source === d)[0]
  //   //     filterEdges.push(edge)
  //   //     d = edge.target
  //   //     filterNodes.push(d)
  //   //   }
  //   //   // 返回删选出来的点集，边集
  //   //   return [filterNodes, filterEdges]
  //   // };
  //   // 筛选出层次树
  //   let filterEdges = (edges, d) => {
  //     let Q = [d];
  //     let filterEdges = [];
  //     let filterNodes = [d];
  //     while (Q.length > 0) {
  //       let node = Q.shift();
  //       let edge = edges.filter(e => e.target === node);
  //       filterEdges.push(...edge);
  //       for (let i = 0; i < edge.length; i++) {
  //         if (edge[i].source) {
  //           filterNodes.push(edge[i].source);
  //           Q.push(edge[i].source);
  //         }
  //       }
  //     }
  //     console.log(filterNodes, filterEdges);
  //     return [filterNodes, filterEdges];
  //   };
  //   // 鼠标悬浮，对筛选出来的边改变颜色，粗细，不透明度；点修改不透明度；文字显示
  //   function mouseoverFuncEdges(edges, d) {
  //     let highlightNodes = filterEdges(edges, d)[0];
  //     let highlightEdges = filterEdges(edges, d)[1];
  //     d3.selectAll('path')
  //       .attr('stroke', e => {
  //         return highlightEdges.indexOf(e) !== -1 ? 'Crimson' : 'lightgray';
  //       })
  //       .attr('stroke-width', e => {
  //         return highlightEdges.indexOf(e) !== -1 ? 3 : 2;
  //       })
  //       .attr('stroke-opacity', e => {
  //         return highlightEdges.indexOf(e) !== -1 ? 1 : 0.3;
  //       });
  //     d3.selectAll('circle').attr('opacity', e => {
  //       return highlightNodes.indexOf(e) !== -1 ? 1 : 0.3;
  //     });
  //     // d3.selectAll('.nodeText').text(e => {
  //     //   if (highlightNodes.indexOf(e) !== -1) {
  //     //     if (e.entityType === 'EQUIPMENT') return e.name;
  //     //     if (d === e) return e.name;
  //     //   }
  //     //   return '';
  //     // });
  //   }
  //   if (data) {
  //     const edges = data.links;
  //     d3.selectAll('circle').attr('r', d => {
  //       if (d.id === treeHighlight) {
  //         mouseoverFuncEdges(edges, d);
  //       }
  //       return 5;
  //     });
  //   }
  //   setData(data);
  // }, [treeHighlight]);

  useEffect(() => {
    // 筛选出层次树
    let filterNodes_Edges = (edges, d) => {
      let Q = [d];
      let filterEdges = [];
      let filterNodes = [d];
      while (Q.length > 0) {
        let node = Q.shift();
        let edge = edges.filter(e => e.target === node);
        filterEdges.push(...edge);
        for (let i = 0; i < edge.length; i++) {
          if (edge[i].source) {
            filterNodes.push(edge[i].source);
            Q.push(edge[i].source);
          }
        }
      }
      return [filterNodes, filterEdges];
    };

    // 更新层次树
    if (data) {
      const edges = data.links;
      const nodes = data.nodes;
      for (let i = 0; i < nodes.length; i++) {
        let d = nodes[i];
        if (d.id === treeHighlight) {
          let filterNodes = filterNodes_Edges(edges, d)[0];
          let filterEdges = filterNodes_Edges(edges, d)[1];
          drawNetwork({
            nodes: filterNodes,
            links: filterEdges,
            categories: [{ name: 'CAUSE' },
            { name: 'EQUIPMENT' },
            { name: 'PHENOMENON' },
            { name: 'PROCESSING_METHODS' },
            { name: 'FAULT' }
            ]
          }, '')
        }
      }
    }
    setData(data);
  }, [treeHighlight])


  // 故障列表faultID更新后，在网络图中高亮
  useEffect(() => {
    // 悬浮在点上获取到达根节点的路径和节点集
    let filterEdges = (edges, d) => {
      let filterEdges = [];
      let filterNodes = [d];
      //  若点的类型是故障，则需要找到 现象，处理方法，原因节点，以及对应的路径
      if (d.entityType === 'FAULT') {
        filterEdges = edges.filter(e => e.target === d);
        for (let i = 0; i < filterEdges.length; i++) {
          filterNodes.push(filterEdges[i].source);
        }
      }
      // 找到设备到根节点的路径以及节点
      while (d.name !== '滨海电厂') {
        let edge = edges.filter(e => e.source === d)[0];
        filterEdges.push(edge);
        d = edge.target
        filterNodes.push(d);
      }
      // 返回删选出来的点集，边集
      return [filterNodes, filterEdges]
    };
    // 鼠标悬浮，对筛选出来的边改变颜色，粗细，不透明度；点修改不透明度；文字显示
    function mouseoverFuncEdges(edges, d) {
      let highlightNodes = filterEdges(edges, d)[0];
      let highlightEdges = filterEdges(edges, d)[1];
      d3.selectAll('path')
        .attr('stroke', e => {
          return highlightEdges.indexOf(e) !== -1 ? 'Crimson' : 'lightgray';
        })
        .attr('stroke-width', e => {
          return highlightEdges.indexOf(e) !== -1 ? 3 : 2;
        })
        .attr('stroke-opacity', e => {
          return highlightEdges.indexOf(e) !== -1 ? 1 : 0.3;
        });
      d3.selectAll('circle').attr('opacity', e => {
        return highlightNodes.indexOf(e) !== -1 ? 1 : 0.3;
      });
      d3.selectAll('.nodeText').text(e => {
        if (highlightNodes.indexOf(e) !== -1) {
          if (e.entityType === 'EQUIPMENT') return e.name;
          if (d === e) return e.name;
        }
        return '';
      });
    }
    if (data) {
      const edges = data.links;
      d3.selectAll('circle').attr('r', d => {
        // console.log(d)
        if (d.entityType == 'FAULT') {
          if (d.id === faultID || d.equipmentId === faultID || d.regulationId === faultID) {
            mouseoverFuncEdges(edges, d);
          }
        }
        return 5;
      });
    }
  }, [faultID]);

  // d3 网络图
  let drawNetwork = (data, keyword) => {
    // 画布大小
    // const width = window.innerWidth
    const div = document.getElementsByClassName('content')[0];
    // 根据页面调整画布宽度
    let width = div.offsetWidth;
    if (title === 'fault') {
      width = width - 600;
    }
    if (title === 'search') {
      width = width - 300;
      if (keyword) width = width - 350;
    }
    // if (keyword || refresh) width -= 700;
    let height = window.innerHeight;

    // 移除svg中的元素，重新生成画布
    d3.selectAll('.node').remove();
    d3.selectAll('.link').remove();
    d3.selectAll('.nodeText').remove();
    d3.selectAll('.textLegend').remove();
    d3.selectAll('.rectLegend').remove();

    // 定义svg，修改svg的宽高
    let svg = d3.select('#graph')
      .attr('height', height)
      .attr('width', width);
    svg.on('zoom', null);
    // 颜色映射
    const keyColors = {
      'CAUSE': "rgb(55,126,184)",
      'EQUIPMENT': "rgb(77,175,74)",
      "PHENOMENON": "rgb(255,137,22)",
      "PROCESSING_METHODS": "#e15759",
      'FAULT': "#17becf",
      '原因': "rgb(55,126,184)",
      '设备': "rgb(77,175,74)",
      "现象": "rgb(255,137,22)",
      "处理方法": "#e15759",
      '故障': "#17becf",
    };

    // 图例
    for (let i = 0; i < data.categories.length; i++) {
      svg.append('text').attr('x', 80).attr('y', 60 + 40 * i).text(config[data.categories[i].name]).attr('class', 'textLegend');
      svg.append('rect').attr('x', 40).attr('y', 60 + 40 * i - 14).attr('width', 24).attr('height', 16).attr('fill', keyColors[data.categories[i].name]).attr('rx', 3).attr('class', 'rectLegend');
    }

    // 画布的放缩，拖动交互
    const g = svg.append("g").attr('id', 'total_G');

    svg.attr('transform', `translate(0,0) scale(${1})`);
    g.attr('transform', `translate(0,0) scale(${1})`);
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.000000000005, 10])
        .on("zoom", (ev) => {
          g.attr(
            "transform",
            `translate(${ev.transform.x},${ev.transform.y}) scale(${ev.transform.k})`
          );
        })
    );

    //点，边数据 
    const nodes = data.nodes;
    const edges = data.links;

    // 修改网络图布局
    // link力 .strength(1)
    // charge力 .strength(-15)
    // collide力 8

    // 力模型
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id.toString()).strength(1))
      .force('charge', d3.forceManyBody().strength(-15))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(8))
      // .force('x', d3.forceX())
      // .force('y', d3.forceY())
      .on('tick', ticked);

    // 画边
    const link = g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('class', 'link')
      .attr('stroke', 'lightgray')
      // 鼠标悬浮，添加title
      .on('mouseover', function () {
        d3.select(this).append('title').text(d => {
          // d.value消失
          // return d.value 
          return `${d.source.name} > ${d.target.name}`
        })
      });


    // 画点
    const node = g
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', 'node')
      .attr('fill', 'steelblue')
      .attr('fill', d => keyColors[d.entityType])
      .attr('r', 5)
      // .attr('stroke', () => nodes.length > 500 ? 'white' : 'none')
      // .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', (_, d) => {
        mouseoverFunc(d);
      })
      .on('mouseout', () => {
        mouseoutFunc();
      });

    // 节点上的文字
    const text = g
      .append('g')
      .selectAll('.nodeText')
      .data(nodes)
      .join('text')
      .attr('class', 'nodeText')
      .attr('font-size', '14')
      .attr('stroke', 'gray')
      .attr('stroke-width', 0.6)
      // 与鼠标悬浮以及移开的交互一致
      .on('mouseover', (_, d) => {
        // console.log('mouseover', d)
        mouseoverFunc(d)
      })
      .on('mouseout', () => {
        mouseoutFunc();
      })

    // 鼠标悬浮，对筛选出来的边改变颜色，粗细，不透明度；点修改不透明度；文字显示
    function mouseoverFunc(d) {
      let highlightNodes = filter(d)[0];
      let highlightEdges = filter(d)[1];
      d3.selectAll('path')
        .attr('stroke', e => {
          return highlightEdges.indexOf(e) !== -1 ? 'Crimson' : 'lightgray'
        })
        .attr('stroke-width', e => {
          return highlightEdges.indexOf(e) !== -1 ? 3 : 2
        })
        .attr('stroke-opacity', e => {
          return highlightEdges.indexOf(e) !== -1 ? 1 : 0.3
        });
      d3.selectAll('circle').attr('opacity', e => {
        return highlightNodes.indexOf(e) !== -1 ? 1 : 0.3
      });
      d3.selectAll('.nodeText').text(e => {
        if (highlightNodes.indexOf(e) !== -1) {
          if (e.entityType === 'EQUIPMENT') return e.name;
          if (d === e) return e.name;
        }
        return '';
      });
    }

    // 鼠标移开点后的操作 鼠标移开，边颜色，粗细，透明度恢复；点透明度恢复；文字不显示
    function mouseoutFunc() {
      d3.selectAll('path').attr('stroke', 'lightgray').attr('stroke-width', 2).attr('stroke-opacity', 1)
      d3.selectAll('circle').attr('opacity', 1)
      d3.selectAll('.nodeText').text('')
    }

    // 悬浮在点上获取到达根节点的路径和节点集
    let filter = (d: any) => {
      let filterEdges = [];
      let filterNodes = [d];
      //  若点的类型是故障，则需要找到 现象，处理方法，原因节点，以及对应的路径
      if (d.entityType === 'FAULT') {
        filterEdges = edges.filter(e => e.target === d);
        for (let i = 0; i < filterEdges.length; i++) {
          filterNodes.push(filterEdges[i].source);
        }
      }
      // 找到设备到根节点的路径以及节点
      while (d.name !== '滨海电厂') {
        let edge = edges.filter(e => e.source === d)[0];
        if (!edge) break;
        filterEdges.push(edge);
        d = edge.target;
        filterNodes.push(d);
      }
      // 返回删选出来的点集，边集
      return [filterNodes, filterEdges]
    };

    // force的每秒执行
    function ticked() {
      // if (simulation.alpha() < 0.05) simulation.stop();
      // if (simulation.alpha() < 0.01) {
      link.attr('d', linkArc);
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      text.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
      // simulation.stop()
      // }
    }

    // 边的路径，根据需要使用弧线或直线
    let linkArc = (d: any) => {
      // 弧线路径
      // const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      // return `
      //   M${d.source.x},${d.source.y}
      //   A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
      // `;
      // 直线路径
      return `M${d.source.x},${d.source.y} L ${d.target.x} ${d.target.y}`
    };
  };

  return (
    <><svg id="graph"></svg></>
  );
});

export default Graph;
