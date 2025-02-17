import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

LinePlot.propTypes = {
  compras: [],
  vendas: [],
  valoresx: '',
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function LinePlot({
  compras,
  vendas,
  valoresx,
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

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const max = Math.pow(
      10,
      Math.ceil(Math.log10(d3.max([d3.max(compras), d3.max(vendas)])))
    );

    const x = d3.scalePoint().domain(valoresx).range([0, plotWidth]);

    const y = d3.scaleLinear().domain([0, max]).nice().range([plotHeight, 0]);

    const xAxis = d3.axisBottom(x).tickFormat((d) => d);

    const yAxis = d3
      .axisLeft(y)
      .ticks(8)
      .tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));

    const gx = -115;
    const gy = -250;
    const gycolor = -258;

    g.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(xAxis)
      .style('font-size', '12px');

    g.append('g').call(yAxis).style('font-size', '12px');

    const line = d3
      .line()
      .x((d, i) => x(valoresx[i]))
      .y((d) => y(d));

    g.append('path')
      .data([compras])
      .attr('fill', 'none')
      .attr('stroke', '#99b2b7')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    g.selectAll('.compras-point')
      .data(compras)
      .enter()
      .append('circle')
      .attr('class', 'compras-point')
      .attr('cx', (d, i) => x(valoresx[i]))
      .attr('cy', (d) => y(d))
      .attr('r', 2.5)
      .attr('fill', '#536d88');

    g.selectAll('.compras-label')
      .data(compras)
      .enter()
      .append('text')
      .attr('class', 'compras-label')
      .attr('x', (d, i) => x(valoresx[i]))
      .attr('y', (d) => y(d) - 5)
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text((d) => d3.format('.2s')(d).replace('G', 'B'));

    g.append('path')
      .data([vendas])
      .attr('fill', 'none')
      .attr('stroke', '#eac195')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    g.selectAll('.vendas-point')
      .data(vendas)
      .enter()
      .append('circle')
      .attr('class', 'vendas-point')
      .attr('cx', (d, i) => x(valoresx[i]))
      .attr('cy', (d) => y(d))
      .attr('r', 2.5)
      .attr('fill', '#eac195');

    g.selectAll('.vendas-label')
      .data(vendas)
      .enter()
      .append('text')
      .attr('class', 'vendas-label')
      .attr('x', (d, i) => x(valoresx[i]))
      .attr('y', (d) => y(d) - 5)
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text((d) => d3.format('.2s')(d).replace('G', 'B'));

    g.selectAll('.grid-line')
      .data(y.ticks())
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('y1', (d) => y(d))
      .attr('x2', plotWidth)
      .attr('y2', (d) => y(d))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4');

    g.append('g')
      .attr('transform', `translate(0, ${plotHeight + 10})`)
      .append('rect')
      .attr('x', gx)
      .attr('y', gycolor)
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', '#536d88');
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
      .attr('fill', '#eac195');
    g.append('g')
      .attr('transform', `translate(30, ${plotHeight + 30})`)
      .append('text')
      .attr('x', gx)
      .attr('y', gy)
      .attr('font-size', 12)
      .text('Vendas');
  }, [compras, vendas, valoresx]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="chart"></g>
    </svg>
  );
}
