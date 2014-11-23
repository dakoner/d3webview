var margin = {top: 25, right: 15, bottom: 120, left: 30},
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
    .y(function(d) { return y(d.outside_temp); })
    .defined(function(d) {
       return d.date != null && d.date != undefined &&
              d.outside_temp != null && d.outside_temp != undefined && !isNaN(d.outside_temp)});

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("foo.json", function(error, data) {
    if(error) {return console.warn(error)};
      data = data.weatherdata;
      data = data.filter(function(d) {
	    d.date = parseDate(d.created_at);
	    d.outside_temp = parseFloat(d.outside_temp);
	    if (d.outside_temp > 90) return false;
        //if (d.us_units == 0) {
	    //    d.outside_temp = d.outside_temp * 9/5. + 32.
	    //}
	    return true;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.outside_temp; }));

    var dataNest = d3.nest()
        .key(function(d) { return d.uuid; })
        .entries(data);

    var color = d3.scale.category10();
    legendSpace = width/dataNest.length; // spacing for legend

    dataNest.forEach(function(d, i) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                            return d.color = color(d.key); })
            .attr("d", line(d.values));

        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace) // spacing
            .attr("y", height + (margin.bottom/2)+ 25)
            .attr("class", "legend")
            .style("fill", function() {
                return d.color = color(d.key); })
            .text(d.key);
    });

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


});
