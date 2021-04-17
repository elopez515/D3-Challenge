var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty"; 

// Create function to update x-scale var upon click on axis label
function xScale(state_data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(state_data, data => data[chosenXAxis]) * 0.8,
      d3.max(state_data, data => data[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(state_data, err) {
    if (err) throw err;
    console.log(state_data)

    // Parse the data for our chart variables
    state_data.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.age = +data.age;
    });    

    var xLinearScale = xScale(state_data, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()  
        .domain([0, d3.max(state_data, data => data.age)])
        .range([height, 0]);
        
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(state_data)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data[chosenXAxis]))
        .attr("cy", data => yLinearScale(data.age))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".5");


}).catch(function(error) {
    console.log(error);
  });