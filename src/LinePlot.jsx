import * as d3 from "d3";
import {useRef, useEffect} from "react";

export default function LinePlot({
  data,
  valoresx,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 80
}) {
  const gx = useRef();
  const gy = useRef();
  
  
  
  const x = d3.scalePoint()
    .domain(valoresx) 
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear([0, d3.max(data)], [height - marginBottom, marginTop]);

  const yAxis = d3.axisLeft(y).ticks(6).tickFormat(d => d3.format(".2s")(d)); 
  const xAxis = d3.axisBottom(x).tickFormat(d => d); 
  
  const line = d3.line((d, i) => x(valoresx[i]), y); 
  
  useEffect(() => void d3.select(gx.current).call(xAxis), [xAxis]);
  useEffect(() => void d3.select(gy.current).call(yAxis), [yAxis]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(valoresx[i])} cy={y(d)} r="2.5" />
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
    </svg>
  );
}
