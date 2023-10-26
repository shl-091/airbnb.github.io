// Define the dimensions of the graph
const graphWidth = 900;
const graphHeight = 400;
const margin = { top: 50, right: 20, bottom: 50, left: 50 };

// Calculate the inner width and height of the graph
const innerWidth = graphWidth - margin.left - margin.right;
const innerHeight = graphHeight - margin.top - margin.bottom;

// Create the SVG container for the graph
const graphSvg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the dataset
d3.csv("london_weekdays.csv").then(function(data) {
  // Filter the data based on the condition (realSum < 700)
  data = data.filter(d => parseFloat(d.realSum) < 700);

  // Convert the numerical values from strings to numbers
  data.forEach(function(d) {
    d.realSum = parseFloat(d.realSum);
    d.guest_satisfaction_overall = parseFloat(d.guest_satisfaction_overall);
  });

  // Create scales for x and y axes
  const xScaleOriginal = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.guest_satisfaction_overall)])
    .range([0, innerWidth]);

  const xScaleFiltered = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.guest_satisfaction_overall)])
    .range([0, innerWidth]);

  const yScaleOriginal = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.realSum)])
    .range([innerHeight, 0]);

  const yScaleFiltered200 = d3
    .scaleLinear()
    .domain([0, 200])
    .range([innerHeight, 0]);

  const yScaleFiltered500 = d3
    .scaleLinear()
    .domain([200, 500])
    .range([innerHeight, 0]);

  const yScaleFiltered700 = d3
    .scaleLinear()
    .domain([500, 700])
    .range([innerHeight, 0]);

    // Add x-axis label
  graphSvg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2 )
    .attr("y", innerHeight + margin.bottom - 15)
    .attr('font-family', 'Kefa')
    .attr("font-size", '15')
    .style("text-anchor", "middle")
    .text("Satisfaction Score");

  // Add y-axis label
  graphSvg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 8 +10)
    .attr("font-size", '15')
    .attr('font-family', 'Kefa')
    .style("text-anchor", "middle")
    .text("Price");

  // Create and append the scatter plot circles for the original graph
  const circlesOriginal = graphSvg
    .selectAll(".circle-original")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle-original")
    .attr("cx", d => xScaleOriginal(d.guest_satisfaction_overall))
    .attr("cy", d => yScaleOriginal(d.realSum))
    .attr("r", 3)
    .attr("fill", "#EEA47F");

  // Create and append the scatter plot circles for the filtered graph (0-200)
  const circlesFiltered200 = graphSvg
    .selectAll(".circle-filtered-200")
    .data(data.filter(d => d.realSum <= 200))
    .enter()
    .append("circle")
    .attr("class", "circle-filtered-200")
    .attr("cx", d => xScaleFiltered(d.guest_satisfaction_overall))
    .attr("cy", d => yScaleFiltered200(d.realSum))
    .attr("r", 3)
    .attr("fill", "#E3B448")
    .style("display", "none");

  // Create and append the scatter plot circles for the filtered graph (200-500)
  const circlesFiltered500 = graphSvg
    .selectAll(".circle-filtered-500")
    .data(data.filter(d => d.realSum > 200 && d.realSum <= 500))
    .enter()
    .append("circle")
    .attr("class", "circle-filtered-500")
    .attr("cx", d => xScaleFiltered(d.guest_satisfaction_overall))
    .attr("cy", d => yScaleFiltered500(d.realSum))
    .attr("r", 3)
    .attr("fill", "#CBD18F")
    .style("display", "none");

  // Create and append the scatter plot circles for the filtered graph (500-700)
  const circlesFiltered700 = graphSvg
    .selectAll(".circle-filtered-700")
    .data(data.filter(d => d.realSum > 500 && d.realSum <= 700))
    .enter()
    .append("circle")
    .attr("class", "circle-filtered-700")
    .attr("cx", d => xScaleFiltered(d.guest_satisfaction_overall))
    .attr("cy", d => yScaleFiltered700(d.realSum))
    .attr("r", 3)
    .attr("fill", "#3A6B35")
    .style("display", "none");

  // Add x-axis for the original graph
  const xAxisOriginal = graphSvg
    .append("g")
    .attr("class", "x-axis-original")
    .attr("transform", `translate(0,${innerHeight})`)
    .attr("font-family", "Kefa")
    .call(d3.axisBottom(xScaleOriginal));

  // Add x-axis for the filtered graph
  const xAxisFiltered = graphSvg
    .append("g")
    .attr("class", "x-axis-filtered")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleFiltered))
    .attr("font-family", "Kefa")
    .style("display", "none");

  // Add y-axis for the original graph
  const yAxisOriginal = graphSvg
    .append("g")
    .attr("class", "y-axis-original")
    .attr("font-family", "Kefa")
    .call(d3.axisLeft(yScaleOriginal));

  // Add y-axis for the filtered graph (0-200)
  const yAxisFiltered200 = graphSvg
    .append("g")
    .attr("class", "y-axis-filtered-200")
    .call(d3.axisLeft(yScaleFiltered200))
    .attr("font-family", "Kefa")
    .style("display", "none");

  // Add y-axis for the filtered graph (200-500)
  const yAxisFiltered500 = graphSvg
    .append("g")
    .attr("class", "y-axis-filtered-500")
    .call(d3.axisLeft(yScaleFiltered500))
    .attr("font-family", "Kefa")
    .style("display", "none");

  // Add y-axis for the filtered graph (500-700)
  const yAxisFiltered700 = graphSvg
    .append("g")
    .attr("class", "y-axis-filtered-700")
    .attr("font-family", "Kefa")
    .call(d3.axisLeft(yScaleFiltered700))
    .style("display", "none");

  // Add graph title
  graphSvg
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -margin.top / 2 + 10)
    .attr("text-anchor", "middle")
    .attr("class", "graph-title")
    .text("Scatter Plot of Price vs Guest satisfaction")
    .attr("font-family", "Impact");

  // Add buttons
  const buttons = [
    { id: "button-original", label: "Original", range: [null, null] },
    { id: "button-0-200", label: "0-200", range: [0, 200] },
    { id: "button-200-500", label: "200-500", range: [200, 500] },
    { id: "button-500-700", label: "500-700", range: [500, 700] }
  ];

 


  const buttonContainer = d3.select("#graph-container")
    .append("div")
    .attr("class", "button-container")
    .style("text-align", "center");

    buttons.forEach(button => {
      buttonContainer
        .append("button")
        .attr("id", button.id)
        .text(button.label)
        .on("click", function() {
          updateData(button.range);
        });
    });
  

  // Function to update the data
  function updateData(range) {
    // Toggle display of circles based on the selected range
    circlesOriginal.style("display", range[0] === null ? "inherit" : "none");
    circlesFiltered200.style("display", d => {
      return d.realSum >= range[0] && d.realSum <= range[1] ? "inherit" : "none";
    });
    circlesFiltered500.style("display", d => {
      return d.realSum >= range[0] && d.realSum <= range[1] ? "inherit" : "none";
    });
    circlesFiltered700.style("display", d => {
      return d.realSum >= range[0] && d.realSum <= range[1] ? "inherit" : "none";
    });

    // Toggle display of axes based on the selected range
    xAxisOriginal.style("display", range[0] === null ? "inherit" : "none");
    xAxisFiltered.style("display", range[0] !== null ? "inherit" : "none");
    yAxisOriginal.style("display", range[0] === null ? "inherit" : "none");
    yAxisFiltered200.style("display", range[0] === 0 ? "inherit" : "none");
    yAxisFiltered500.style("display", range[0] === 200 ? "inherit" : "none");
    yAxisFiltered700.style("display", range[0] === 500 ? "inherit" : "none");

    // Update y-axis scales based on the selected range
    yScaleFiltered200.domain([0, range[1]]);
    yScaleFiltered500.domain([range[0], range[1]]);
    yScaleFiltered700.domain([range[0], range[1]]);
    yAxisFiltered200.call(d3.axisLeft(yScaleFiltered200));
    yAxisFiltered500.call(d3.axisLeft(yScaleFiltered500));
    yAxisFiltered700.call(d3.axisLeft(yScaleFiltered700));
  }

  // Set the default view to the "Original" graph
  updateData([null, null]);
});
