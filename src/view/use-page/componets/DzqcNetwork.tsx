import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';

const data = require('../dzqc-page/data/滨海二期#3机组定值清册20190505.json');

const Graph = React.forwardRef((props: any, ref) => {
  // const { refresh, keyword, callback, func = getTripleSearchData, treeHighlight, faultID, title } = props;
  // const [data, setData] = useState(null);

  useEffect(() => {
    if (data) {
      drawNetwork(data);
    }
  }, [data]);

  // d3 网络图
  let drawNetwork = (data) => {
    const colorMap = {
      '机组': "#4e79a7",
      '系统名称': "#f28e2c",
      '系统': "#e15759",
      '信号': "#76b7b2",
      '设备': "#59a14f",
      '属性': "#edc949"
    }

    const categories = ['机组', '系统名称', '系统', '信号', '设备', '属性']
    const div = document.getElementsByClassName('content')[0];
    let width = div.offsetWidth;
    let height = window.innerHeight;
    let svg = d3.select('#graph')
      .attr('height', height)
      .attr('width', width);
    for (let i = 0; i < categories.length; i++) {
      svg.append('text').attr('x', 80).attr('y', 60 + 40 * i).text([categories[i]]).attr('class', 'textLegend');
      svg.append('rect').attr('x', 40).attr('y', 60 + 40 * i - 14).attr('width', 24).attr('height', 16).attr('fill', colorMap[categories[i]]).attr('rx', 3).attr('class', 'rectLegend');
    }
    const g = svg.append("g");
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", (ev) => {
          g.attr(
            "transform",
            `translate(${ev.transform.x},${ev.transform.y}) scale(${ev.transform.k})`
          );
        })
    );
    const nodes = data.nodes;
    const edges = data.edges;
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges))
      .force("charge", d3.forceManyBody().strength(-25))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(8))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);
    // console.log(nodes, edges);
    const link = g
      .append("g")
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(edges)
      .join("line");

    const node = g
      .append("g")
      .attr("stroke", "white")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => colorMap[d.type])
      .attr("opacity", (d) => (d.name === "" ? 0 : 1))
      .on("mouseover", function (e, d) {
        d3.select(this).append("title").text(d.name);
      })
      .call(drag(simulation));

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  };

  return (
    <><svg id="graph"></svg></>
  );
});

export default Graph;
