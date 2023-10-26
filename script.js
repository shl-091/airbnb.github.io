// // Set the dimensions and margins of the map
// const mapMargin = { top: 35, right: 20, bottom: 5, left: 20 };
// const mapWidth = 900 - mapMargin.left - mapMargin.right;
// const mapHeight = 550 - mapMargin.top - mapMargin.bottom;

// // Set up a projection for the map
// const projection = d3.geoMercator()
//   .center([-0.1, 51.5]) // Center the map around London coordinates
//   .scale(45000) // Adjust the scale for zoom level
//   .translate([mapWidth / 2, mapHeight / 2 + 40]); // Translate the map to the center of the SVG container

// // Create a path generator using the projection
// const path = d3.geoPath().projection(projection);

// // Select the existing London map SVG container and add margins
// const mapSvg = d3.select("#map-container")
//   .append("svg")
//   .attr("width", mapWidth + mapMargin.left + mapMargin.right)
//   .attr("height", mapHeight + mapMargin.top + mapMargin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");

// // Load the Airbnb house data
// d3.csv("london_weekdays.csv").then(function(data) {
//   // Filter the data based on the condition (realSum > 500)
//   const filteredData = data.filter(function(d) {
//     return +d.realSum;
//   });

//   // Load the GeoJSON data for London boundaries
//   d3.json("london.geojson").then(function(geojson) {
//     // Bind the GeoJSON features to path elements
//     mapSvg.selectAll("path")
//       .data(geojson.features)
//       .enter()
//       .append("path")
//       .attr("d", path)
//       .attr("fill", function(d) {
//         const regionSatisfactionData = filteredData.filter(function(house) {
//           return d3.geoContains(d, [house.lng, house.lat]);
//         });
//         const averageSatisfaction = d3.mean(regionSatisfactionData, function(house) {
//           return house.guest_satisfaction_overall;
//         });
//         if (isNaN(averageSatisfaction)) {
//           return "#FCEDDA"; // Set regions with no average score to gray
//         }
//         return d3.interpolateReds(averageSatisfaction / 100); // Normalize the average satisfaction to range from 0 to 1
//       })
//       .attr("stroke", "white")
//       .attr("stroke-width", 0.3)
//       .on("mouseover", handleMouseOver) // Add mouseover event listener
//       .on("mouseout", handleMouseOut); // Add mouseout event listener

//     // Add circles for Airbnb house locations
//     const airbnbCircles = mapSvg.selectAll(".airbnb-house")
//       .data(filteredData)
//       .enter()
//       .append("circle")
//       .attr("class", "airbnb-house")
//       .attr("cx", function(d) { return projection([d.lng, d.lat])[0]; })
//       .attr("cy", function(d) { return projection([d.lng, d.lat])[1]; })
//       .attr("r", 1)
//       .attr("fill", "#00539C")
//       .style("visibility", "hidden");
//     // Add graph title
//     mapSvg
//       .append("text")
//       .attr("x", mapWidth / 2)
//       .attr("y", 30)
//       .attr("text-anchor", "middle")
//       .attr("class", "graph-title")
//       .text("London Airbnb Average Satisfaction Score Distribution")
//       .attr("font-family", "Impact");

//     const minSatisfaction = d3.min(filteredData, d => d.guest_satisfaction_overall);
//     const maxSatisfaction = d3.max(filteredData, d => d.guest_satisfaction_overall);

//     const valueRange = [minSatisfaction, maxSatisfaction]
//     // Set up the color scale using a logarithmic scale and a color range
//     let colorScale = d3.scaleSequentialLog(d3.interpolateReds)
//       .domain(valueRange);

//     // Set up the map dimensions
//     let width = 1000;
//     let height = 400;

//     // Set up the legend dimensions
//     let legendWidth = 100;
//     let legendHeight = mapHeight / 1.3;

//     // Create a group for the legend
//     let legendGroup = mapSvg.append("g")
//       .attr("transform", `translate(${50}, ${mapHeight / 5-20})`);

//     // Create the legend scale
//     let legendScale = d3.scaleLinear()
//       .domain([0, 100]) // Adjust the domain to match the range of satisfaction scores (0 to 100)
//       .range([legendHeight, 0]);

//     let legendAxis = d3.axisRight(legendScale)
//       .ticks(5) // Adjust the number of ticks as per your preference
//       .tickSize(0) // Hide the tick marks
//       .tickPadding(6);

//     legendGroup.append("g")
//       .attr("class", "axis")
//       .attr("transform", `translate(10, 0)`)
//       .call(legendAxis);

//     legendGroup.append("rect")
//       .attr("width", 10)
//       .attr("height", legendHeight)
//       .attr("fill", "url(#legend-gradient)");

//     let legendGradient = legendGroup.append("defs")
//       .append("linearGradient")
//       .attr("id", "legend-gradient")
//       .attr("gradientUnits", "userSpaceOnUse")
//       .attr("x1", 0)
//       .attr("y1", legendHeight)
//       .attr("x2", 0)
//       .attr("y2", 0);

//     legendGradient.append("stop")
//       .attr("offset", "0%")
//       .attr("stop-color", colorScale(valueRange[0]));

//     legendGradient.append("stop")
//       .attr("offset", "100%")
//       .attr("stop-color", colorScale(valueRange[1]));

//     legendGroup.append("text")
//       .attr("class", "legend-title")
//       .attr("x", 0)
//       .attr("y", -10)
//       .text("Score");

//       function handleMouseOver(d, i) {
//         // Increase the stroke width of the selected region
//         d3.select(this)
//           .attr("stroke-width", 2)
//           .attr("opacity", 1);
//       }
  
//       // Function to handle mouseout event
//       function handleMouseOut(d, i) {
//         // Reset the stroke width and opacity of all regions
//         d3.selectAll("path")
//           .attr("stroke-width", 0.3)
//           .attr("opacity", 0.8);
//       }
  
//       // Function to show the point (circle)
//       const showPoint = function() {
//         airbnbCircles.style("visibility", "visible");
//       };
  
//       // Function to remove the point (circle)
//       const removePoint = function() {
//         airbnbCircles.style("visibility", "hidden");
//       };
  
//       // Create a button container
//       const buttonContainer = d3.select("#map-container")
//         .append("div")
//         .attr("class", "button-container")
//         .style("text-align", "center");
  
//       // Create the "Show the point" button
//       const showButton = buttonContainer
//         .append("button")
//         .text("Show the point")
//         .on("click", showPoint);
  
//       // Create the "Remove the point" button
//       const removeButton = buttonContainer
//         .append("button")
//         .text("Remove the point")
//         .on("click", removePoint);
  
//       // Event listener for mouseout event on the map container
//       d3.select("#map-container")
//         .on("mouseout", function() {
//           // Reset the stroke width and opacity of all regions
//           d3.selectAll("path")
//             .attr("stroke-width", 0.3)
//             .attr("opacity", 1);
//         });
//     });
//   });


// Set the dimensions and margins of the map
const mapMargin = { top: 35, right: 20, bottom: 5, left: 20 };
const mapWidth = 900 - mapMargin.left - mapMargin.right;
const mapHeight = 550 - mapMargin.top - mapMargin.bottom;

// Set up a projection for the map
const projection = d3.geoMercator()
  .center([-0.1, 51.5]) // Center the map around London coordinates
  .scale(45000) // Adjust the scale for zoom level
  .translate([mapWidth / 2, mapHeight / 2 + 40]); // Translate the map to the center of the SVG container

// Create a path generator using the projection
const path = d3.geoPath().projection(projection);

// Select the existing London map SVG container and add margins
const mapSvg = d3.select("#map-container")
  .append("svg")
  .attr("width", mapWidth + mapMargin.left + mapMargin.right)
  .attr("height", mapHeight + mapMargin.top + mapMargin.bottom)
  .append("g")
  .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");

// Load the Airbnb house data
d3.csv("london_weekdays.csv").then(function(data) {
  // Filter the data based on the condition (realSum > 500)
  const filteredData = data.filter(function(d) {
    return +d.realSum;
  });

  // Load the GeoJSON data for London boundaries
  d3.json("london.geojson").then(function(geojson) {
    // Bind the GeoJSON features to path elements
    mapSvg.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function(d) {
        const regionSatisfactionData = filteredData.filter(function(house) {
          return d3.geoContains(d, [house.lng, house.lat]);
        });
        const averageSatisfaction = d3.mean(regionSatisfactionData, function(house) {
          return house.guest_satisfaction_overall;
        });
        if (isNaN(averageSatisfaction)) {
          return "#FCEDDA"; // Set regions with no average score to gray
        }
        return d3.interpolateReds(averageSatisfaction / 100); // Normalize the average satisfaction to range from 0 to 1
      })
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .on("mouseover", handleMouseOver) // Add mouseover event listener
      .on("mouseout", handleMouseOut); // Add mouseout event listener

    // Add circles for Airbnb house locations
    const airbnbCircles = mapSvg.selectAll(".airbnb-house")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "airbnb-house")
      .attr("cx", function(d) { return projection([d.lng, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lng, d.lat])[1]; })
      .attr("r", 1)
      .attr("fill", "#00539C")
      .style("visibility", "hidden");
    // Add graph title
    mapSvg
      .append("text")
      .attr("x", mapWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("class", "graph-title")
      .text("London Airbnb Average Satisfaction Score Distribution")
      .attr("font-family", "Impact");

    const minSatisfaction = d3.min(filteredData, d => d.guest_satisfaction_overall);
    const maxSatisfaction = d3.max(filteredData, d => d.guest_satisfaction_overall);

    const valueRange = [minSatisfaction, maxSatisfaction]
    // Set up the color scale using a logarithmic scale and a color range
    let colorScale = d3.scaleSequentialLog(d3.interpolateReds)
      .domain(valueRange);

    // Set up the map dimensions
    let width = 1000;
    let height = 400;

    // Set up the legend dimensions
    let legendWidth = 100;
    let legendHeight = mapHeight / 1.3;

    // Create a group for the legend
    let legendGroup = mapSvg.append("g")
      .attr("transform", `translate(${50}, ${mapHeight / 5-20})`);

    // Create the legend scale
    let legendScale = d3.scaleLinear()
      .domain([0, 100]) // Adjust the domain to match the range of satisfaction scores (0 to 100)
      .range([legendHeight, 0]);

    let legendAxis = d3.axisRight(legendScale)
      .ticks(5) // Adjust the number of ticks as per your preference
      .tickSize(0) // Hide the tick marks
      .tickPadding(6);

    legendGroup.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(10, 0)`)
      .call(legendAxis);

    legendGroup.append("rect")
      .attr("width", 10)
      .attr("height", legendHeight)
      .attr("fill", "url(#legend-gradient)");

    let legendGradient = legendGroup.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", legendHeight)
      .attr("x2", 0)
      .attr("y2", 0);

    legendGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorScale(valueRange[0]));

    legendGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorScale(valueRange[1]));

    legendGroup.append("text")
      .attr("class", "legend-title")
      .attr("x", 0)
      .attr("y", -10)
      .text("Score");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      function handleMouseOver(event, d) {
        // Increase the stroke width of the selected region
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("opacity", 1);
      
        // Get the satisfaction score for the current region
        const regionSatisfactionData = filteredData.filter(function(house) {
          return d3.geoContains(d, [house.lng, house.lat]);
        });
        const averageSatisfaction = d3.mean(regionSatisfactionData, function(house) {
          return house.guest_satisfaction_overall;
        });
      
        // Show the tooltip next to the mouse cursor
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html("Satisfaction Score: " + averageSatisfaction)
          .style("left", (event.pageX + 10) + "px")  // Add an offset to the left position
          .style("top", (event.pageY - 10) + "px");  // Add an offset to the top position
      }
      
  
      // Function to handle mouseout event
      function handleMouseOut(d, i) {
        // Reset the stroke width and opacity of all regions
        d3.selectAll("path")
          .attr("stroke-width", 0.3)
          .attr("opacity", 0.8);
      
        // Hide the tooltip
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      }
  
      // Function to show the point (circle)
      const showPoint = function() {
        airbnbCircles.style("visibility", "visible");
      };
  
      // Function to remove the point (circle)
      const removePoint = function() {
        airbnbCircles.style("visibility", "hidden");
      };
  
      // Create a button container
      const buttonContainer = d3.select("#map-container")
        .append("div")
        .attr("class", "button-container")
        .style("text-align", "center");
  
      // Create the "Show the point" button
      const showButton = buttonContainer
        .append("button")
        .text("Show the point")
        .on("click", showPoint);
  
      // Create the "Remove the point" button
      const removeButton = buttonContainer
        .append("button")
        .text("Remove the point")
        .on("click", removePoint);
  
      // Event listener for mouseout event on the map container
      d3.select("#map-container")
        .on("mouseout", function() {
          // Reset the stroke width and opacity of all regions
          d3.selectAll("path")
            .attr("stroke-width", 0.3)
            .attr("opacity", 1);
        });
    });
  });