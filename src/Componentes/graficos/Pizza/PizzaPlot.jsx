import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

PizzaPlot.propTypes = {
  data: [],
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function PizzaPlot({
  data,
  width = 900,
  height = 400,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 80,
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
    const radius = Math.min(plotWidth, plotHeight) / 2;

    // Limpeza do SVG antes de desenhar
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left + plotWidth / 8},${margin.top + plotHeight / 2})`);

    // Criação do gerador de pizza
    const pie = d3.pie()
      .value(d => d.porcentagem)
      .sort(null);

    // Gerador de arcos
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Escala de cores
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.descricao))
      .range(d3.schemeCategory10);

    // Desenha os segmentos
    const arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.descricao))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Adiciona as porcentagens no gráfico com um pequeno afastamento
    arcs.append('text')
      .attr('transform', (d) => {
        const centroid = arc.centroid(d);
        // Afastando o texto um pouco mais do centro
        const offset = 20; // Pode ajustar esse valor conforme necessário
        return `translate(${centroid[0] * 1.5},${centroid[1] * 1.5})`; // Multiplicando por 1.1 para afastar
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', 'white')
      .attr('stroke-width', 1.5)
      .text((d) => `${d.data.porcentagem}%`);

    // Legenda
    const legend = svg
      .append('g')
      .attr('transform', `translate(${plotWidth - 200},${margin.top})`);

    data.forEach((d, i) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem
        .append('rect')
        .attr('x', -360)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', color(d.descricao));

      legendItem
        .append('text')
        .attr('x', -330)
        .attr('y', 9)
        .attr('dy', '0.32em')
        .style('font-size', '15px')
        .text(`${d.descricao}`);
    });

  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="chart"></g>
    </svg>
  );
}
