import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

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
  const gx = useRef();
  const gy = useRef();

  const max = Math.pow(
    10,
    Math.ceil(Math.log10(d3.max([d3.max(compras), d3.max(vendas)])))
  );

  const x = d3
    .scalePoint()
    .domain(valoresx)
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear([0, max], [height - marginBottom, marginTop]);
  console.log(max);
  const yAxis = d3
    .axisLeft(y)
    .ticks(8)
    .tickFormat((d) => d3.format('.2s')(d).replace('G', 'B'));

  const xAxis = d3.axisBottom(x).tickFormat((d) => d);

  const line = d3.line((d, i) => x(valoresx[i]), y);

  useEffect(() => void d3.select(gx.current).call(xAxis), [xAxis]);
  useEffect(() => void d3.select(gy.current).call(yAxis), [yAxis]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />

      <path fill="none" stroke="blue" strokeWidth="1.5" d={line(compras)} />
      <g fill="white" stroke="black" strokeWidth="0.5">
        {compras.map((d, i) => (
          <g key={i}>
            <circle cx={x(valoresx[i])} cy={y(d)} r="2.5" />
            <text
              x={x(valoresx[i])}
              y={y(d) - 5}
              fontSize="12"
              textAnchor="middle"
              fill="black"
            >
              {d3.format('.2s')(d).replace('G', 'B')}
            </text>
          </g>
        ))}
      </g>

      <path fill="none" stroke="orange" strokeWidth="1.5" d={line(vendas)} />
      <g fill="white" stroke="black" strokeWidth="0.5">
        {vendas.map((d, i) => (
          <g key={i}>
            <circle cx={x(valoresx[i])} cy={y(d)} r="2.5" />
            <text
              x={x(valoresx[i])}
              y={y(d) - 5}
              fontSize="12"
              textAnchor="middle"
              fill="black"
            >
              {d3.format('.2s')(d).replace('G', 'B')}
            </text>
          </g>
        ))}
      </g>

      <g>
        {y.ticks().map((tickValue, i) => (
          <line
            key={i}
            x1={marginLeft}
            y1={y(tickValue)}
            x2={width - marginRight}
            y2={y(tickValue)}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}
      </g>

      <g transform={`translate(${marginLeft}, ${marginTop})`}>
        <rect width="20" height="10" fill="blue" x="-120" />
        <text x="-90" y="10" fontSize="12">
          Compras
        </text>
        <rect width="20" height="10" fill="orange" x="-120" y="20" />
        <text x="-90" y="30" fontSize="12">
          Vendas
        </text>
      </g>
    </svg>
  );
}
