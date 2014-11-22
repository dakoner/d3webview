var today = new Date();

var margin = {top: 25, right: 15, bottom: 80, left: 25},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var parseDate = d3.time.format("%a, %d %b %Y %H:%M:%S -0000").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.days, 1)
    .tickFormat(d3.time.format("%Y-%m-%d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.outside_temp); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("file:///android_asset/static_html/example_weather.json", function(error, data) {

    if(error) {return console.warn(error)};
    data = data.weatherdata;
    data.forEach(function(d) {
	d.date = parseDate(d.created_at);
	d.outside_temp = parseFloat(d.outside_temp);
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.outside_temp; }));

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
        return "rotate(-90)"
      }
    );

    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)

    svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);
});
