import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

ScatterPlot.propTypes = {
  data: [],
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function ScatterPlot({
  data,
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
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

    // Limpeza do SVG antes de desenhar
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extraindo compras, vendas e nomes dos dados
    console.log(data);
    const compras = data.map(d => d.compras);
    console.log(compras);
    const vendas = data.map(d => d.vendas);
    console.log(vendas);
    const municipios = data.map(d => d.nome);
    console.log(municipios);

    // Escalas para o gráfico
    const x = d3.scaleLinear().domain([0, d3.max(compras)]).nice().range([0, plotWidth]);
    const y = d3.scaleLinear().domain([0, d3.max(vendas)]).nice().range([plotHeight, 0]);

    // Eixos
    const xAxis = d3.axisBottom(x).ticks(8).tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));
    const yAxis = d3.axisLeft(y).ticks(8).tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));

    // Adiciona os eixos
    g.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(xAxis)
      .style('font-size', '12px');

    g.append('g').call(yAxis).style('font-size', '12px');

    // Adicionar títulos aos eixos
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', plotWidth / 2)
      .attr('y', plotHeight + 40)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Total Bruto de Compras');

    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -45)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Total Bruto de Vendas');

    // Adicionar pontos (circulares) ao gráfico de dispersão
    g.selectAll('.scatter-point')
      .data(compras)
      .enter()
      .append('circle')
      .attr('class', 'scatter-point')
      .attr('cx', (d) => x(d))
      .attr('cy', (d, i) => y(vendas[i]))
      .attr('r', 4)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7);

    // Linhas de grade horizontais
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
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="chart"></g>
    </svg>
  );
}
