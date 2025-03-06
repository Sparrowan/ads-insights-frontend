"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Props {
  data: { date_start: string; impressions: number }[];
}

const D3LineChart: React.FC<Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    const width = 800,
      height = 450,
      margin = { top: 50, right: 50, bottom: 50, left: 70 };

    // Parse Dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formattedData = data.map((d) => ({
      ...d,
      date: parseDate(d.date_start) as Date,
    }));

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.impressions)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line Generator
    const line = d3
      .line<{ date: Date; impressions: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.impressions))
      .curve(d3.curveCatmullRom); // Smooth Bezier Curve

    // Add Background Gradient
    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", 0)
      .attr("y2", 0);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4facfe");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00f2fe");

    // Add Line with Animation
    const path = svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 3.5)
      .attr("stroke-linecap", "round")
      .attr("d", line);

    const totalLength = path.node()!.getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((d: Date | { valueOf(): number }) =>
            d3.timeFormat("%b %d")(new Date(d.toLocaleString()))
          )
      )
      .selectAll("text")
      .attr("fill", "#555")
      .style("font-size", "14px");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll("text")
      .attr("fill", "#555")
      .style("font-size", "14px");

    // Grid Lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "5,5");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "14px")
      .style("opacity", 0);

    // Data Points
    svg
      .selectAll("circle")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.impressions))
      .attr("r", 6)
      .attr("fill", "#4facfe")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("fill", "#ff4081");

        tooltip
          .html(
            `<strong>${d3.timeFormat("%Y-%m-%d")(
              d.date
            )}</strong><br>Impressions: ${d.impressions}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px")
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .attr("fill", "#4facfe");

        tooltip.transition().duration(500).style("opacity", 0);
      });

    // X Axis Label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .text("Date");

    // Y Axis Label
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .text("Impressions");
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg ref={ref} width={800} height={450} />
    </div>
  );
};

export default D3LineChart;
