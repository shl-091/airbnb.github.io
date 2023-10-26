d3.json("data.json").then(function(data) {
  const nodes = data.nodes;
  const links = data.links;

  const width = 900;
  const height = 500;
  const margin = { top: 15, right: 20, bottom: 30, left: -10 };
  const svgWidth = width - margin.left - margin.right;
  const svgHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));
  
  // Add graph title
  svg
    .append("text")
    .attr("x", svgWidth / 2)
    .attr("y", -margin.top / 2 + 30)
    .attr("text-anchor", "middle")
    .attr("class", "graph-title")
    .text("Advantages and Disadvantages of London Airbnb in Different Regions")
    .attr("font-family", "Impact");


  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", d => d === links[links.length - 1] || d === links[links.length - 2] || d === links[links.length - 3] ? 2 : d.value / 100) 
    .attr("stroke", "#FBEAEB")
    .attr("class", "link");

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", d => {
      if (d.id === 37 || d.id === 38 || d.id === 39 || d.id === 40) {
        return "#00539C"; // Blue color for nodes 37, 38, 39, 40
      } else if (d.id === 41) {
        return "#E3B448"; // Yellow color for node 41
      } else {
        return "#EEA47F"; // Red color for all other nodes
      }
    })
    .attr("class", "node");

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("font-size", "10px")
    .attr('font-family', 'Kefa')
    .attr("dx", 12)
    .attr("dy", -5) // Adjust the dy value to position the labels above the nodes
    .attr("fill", d => {
      if (d.id === 37 || d.id === 38 || d.id === 39 || d.id === 40) {
        return "#00539C"; // Blue color for nodes 37, 38, 39, 40
      } else if (d.id === 41) {
        return "#E3B448"; // Yellow color for node 41
      } else {
        return "#EEA47F"; // Red color for all other nodes
      }
    })
    .attr("class", "label");

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);

  });
  const highlightLink = (currentLink) => {
    svg.selectAll(".link")
      .attr("stroke-opacity", d => (d === currentLink ? 1 : 0.2));
  
    svg.selectAll(".node")
      .attr("fill-opacity", d => (d === currentLink.source || d === currentLink.target ? 1 : 0.2));
  
    svg.selectAll(".label")
      .attr("fill-opacity", d => (d === currentLink.source || d === currentLink.target ? 1 : 0.2));
  };
  
  svg.selectAll(".link")
    .on("mouseover", (event, d) => {
      highlightLink(d);
    })
    .on("mouseout", (event, d) => {
      resetHighlight();
    });

  const highlightNodes = (currentNode) => {
    const connectedNodes = links.reduce((acc, link) => {
      if (link.source === currentNode) acc.add(link.target);
      else if (link.target === currentNode) acc.add(link.source);
      return acc;
    }, new Set([currentNode]));

    svg.selectAll(".node")
      .attr("fill-opacity", d => connectedNodes.has(d) ? 1 : 0.2);

    svg.selectAll(".link")
      .attr("stroke-opacity", d => {
        const isHighlighted = connectedNodes.has(d.source) && connectedNodes.has(d.target);
        return isHighlighted ? 1 : 0.2;
      });

    svg.selectAll(".label")
      .attr("fill-opacity", d => connectedNodes.has(d) ? 1 : 0.2);
  };

  const resetHighlight = () => {
    svg.selectAll(".node")
      .attr("fill-opacity", 1);

    svg.selectAll(".link")
      .attr("stroke-opacity", 1);

    svg.selectAll(".label")
      .attr("fill-opacity", 1);
  };

  svg.selectAll(".node")
    .on("mouseover", (event, d) => {
      highlightNodes(d);
    })
    .on("mouseout", (event, d) => {
      resetHighlight();
    });

  let zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
      svg.selectAll('.nodes')
        .attr('transform', event.transform);
      svg.selectAll('.links')
        .attr('transform', event.transform);
      svg.selectAll('.labels')
        .attr('transform', event.transform);
    }); 

  svg.call(zoom);
});
