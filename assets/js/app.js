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
var chosenYAxis = "obesity";

// Create function to update x-scale var upon click on axis label
function xScale(state_data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(state_data, data => data[chosenXAxis]) * 0.8,
      d3.max(state_data, data => data[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(state_data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(state_data, data => data[chosenYAxis]) * .9,
      d3.max(state_data, data => data[chosenYAxis]) * 1
    ])
    .range([height, 0]);

  return yLinearScale;

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
        data.abbr =  data.abbr;
    });    

    // initialize our Linear Scales for both axis
    var xLinearScale = xScale(state_data, chosenXAxis);
    var yLinearScale = yScale(state_data, chosenYAxis);
        
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Set data used for circles.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(state_data)
    // Bind our data to our circles
    var enter = circlesGroup.enter();

    // append initial circles
    var circle = enter.append("circle")
        .attr("cx", data => xLinearScale(data[chosenXAxis]))
        .attr("cy", data => yLinearScale(data[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    var circlesText = enter.append("text")
        .attr("dx", data => xLinearScale(data[chosenXAxis]))
        .attr("dy",  data => yLinearScale(data[chosenYAxis]))
        .attr("y", ".30em") 
        .text(data => data.abbr)
        .classed("stateText", true);

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty Level");

    // append y axis
    var obesityLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "age")
        .classed("active", true)
        .text("Obesity");

}).catch(function(error) {
    console.log(error);
  });