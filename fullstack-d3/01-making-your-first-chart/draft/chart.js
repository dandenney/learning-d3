async function drawLineChart() {
  // Checklist 1 of 7 : Access Data
  const dataset = await d3.json("../../my_weather_data.json");
  const yAccessor = d => d.temperatureMax;
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = d => dateParser(d.date);

  // Checklist 2 of 7 : Create chart dimensions
  let dimensions = {
    height: 400,
    margin: {
      bottom: 40,
      left: 60,
      right: 15,
      top: 15
    },
    width: window.innerWidth * 0.9
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Checklist 3 of 7 : Draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("height", dimensions.height)
    .attr("width", dimensions.width);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // Checklist 4 of 7 : Create scales
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const freezingTemperaturePlacement = yScale(32);

  // Checklist 5 of 7 : Draw data
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3
    .line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2);

  // Checklist 6 of 7 : Draw peripherals
  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const yAxis = bounds.append("g").call(yAxisGenerator);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
}

drawLineChart();
