import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

HorizontalBarPlot.propTypes = {
  data: [],
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

export default function HorizontalBarPlot({
  data,
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 150,
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

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.municipio))
      .range([0, plotHeight])
      .padding(0.1);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.icmsTotal)])
      .nice()
      .range([0, plotWidth]);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x).ticks(8).tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('font-size', '12px');

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(xAxis)
      .style('font-size', '12px');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.municipio))
      .attr('x', 0)
      .attr('width', (d) => x(d.icmsTotal))
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue');

    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => x(d.icmsTotal) + 5)
      .attr('y', (d) => y(d.municipio) + y.bandwidth() / 2) 
      .attr('dy', '0.35em') 
      .text((d) => d3.format('.2s')(d.icmsTotal).replace('G', 'B')) 
      .style('font-size', '12px')
      .style('fill', 'black'); 
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="chart"></g>
    </svg>
  );
}
