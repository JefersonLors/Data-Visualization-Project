import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

VerticalBarPlot.propTypes = {
  data: [],
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function VerticalBarPlot({
  data,
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 110,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = {
      top: marginTop,
      right: marginRight,
      bottom: marginBottom,
      left: marginLeft,
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const gx = -115;
    const gy = -250;
    const gycolor = -258;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.estado))
      .range([0, plotWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.icmsCompras, d.icmsVendas))])
      .nice()
      .range([plotHeight, 0]);

    const yAxis = d3
      .axisLeft(y)
      .ticks(8)
      .tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));
    const xAxis = d3.axisBottom(x).tickFormat((d) => d);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('font-size', '12px');

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px');

    g.selectAll('.bar-compras')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-compras')
      .attr('x', (d) => x(d.estado))
      .attr('y', (d) => y(d.icmsCompras))
      .attr('width', x.bandwidth() / 2)
      .attr('height', (d) => plotHeight - y(d.icmsCompras))
      .attr('fill', 'blue');

    g.selectAll('.bar-vendas')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-vendas')
      .attr('x', (d) => x(d.estado) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.icmsVendas))
      .attr('width', x.bandwidth() / 2)
      .attr('height', (d) => plotHeight - y(d.icmsVendas))
      .attr('fill', 'orange');

    g.append('g')
      .attr('transform', `translate(0, ${plotHeight + 10})`)
      .append('rect')
      .attr('x', gx)
      .attr('y', gycolor)
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', 'blue');
    g.append('g')
      .attr('transform', `translate(30, ${plotHeight + 10})`)
      .append('text')
      .attr('x', gx)
      .attr('y', gy)
      .attr('font-size', 12)
      .text('Compras');

    g.append('g')
      .attr('transform', `translate(0, ${plotHeight + 30})`)
      .append('rect')
      .attr('x', gx)
      .attr('y', gycolor)
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', 'orange');
    g.append('g')
      .attr('transform', `translate(30, ${plotHeight + 30})`)
      .append('text')
      .attr('x', gx)
      .attr('y', gy)
      .attr('font-size', 12)
      .text('Vendas');
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="chart"></g>
    </svg>
  );
}
