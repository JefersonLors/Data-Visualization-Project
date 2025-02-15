import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

StackedBarChart.propTypes = {
  data: [],
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function StackedBarChart({
  data,
  width = 700,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 100,
}) {
  const svgRef = useRef();

  const estados = Array.from(new Set(data.map((d) => d.estadoOrigem))); // Lista de estados de origem
  const max = d3.max(data, (d) => d.icmsCompra + d.icmsVenda);

  const x = d3
    .scaleBand()
    .domain(estados)
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, max])
    .nice()
    .range([height - marginBottom, marginTop]);

  const color = d3
    .scaleOrdinal()
    .domain(['icmsCompra', 'icmsVenda'])
    .range(['#8884d8', '#82ca9d']);

  const stack = d3
    .stack()
    .keys(['icmsCompra', 'icmsVenda'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const layers = stack(data);

    svg.selectAll('*').remove(); // Limpa o SVG antes de redesenhar

    // Eixo X
    svg
      .append('g')
      .selectAll('.x-axis')
      .data(estados)
      .enter()
      .append('text')
      .attr('class', 'x-axis')
      .attr('x', (d) => x(d) + x.bandwidth() / 2)
      .attr('y', height - marginBottom + 20)
      .style('text-anchor', 'middle')
      .text((d) => d);

    // Eixo Y
    const yAxis = d3
      .axisLeft(y)
      .ticks(6)
      .tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(yAxis);

    // Barras empilhadas
    svg
      .append('g')
      .selectAll('g')
      .data(layers)
      .enter()
      .append('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.data.estadoOrigem))
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    // Legenda
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`)
      .append('rect')
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', '#8884d8')
      .attr('x', width - marginRight - 100);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`)
      .append('text')
      .attr('x', width - marginRight - 75)
      .attr('y', 10)
      .text('ICMS Compra')
      .style('font-size', '12px');
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`)
      .append('rect')
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', '#82ca9d')
      .attr('x', width - marginRight - 100)
      .attr('y', 20);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`)
      .append('text')
      .attr('x', width - marginRight - 75)
      .attr('y', 30)
      .text('ICMS Venda')
      .style('font-size', '12px');
  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
