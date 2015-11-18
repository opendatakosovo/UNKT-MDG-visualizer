var width = 350,
height = 400,
radius = Math.min(width, height) / 2,
innerRadius = 0.3 * radius;

// Colors
var wedge_color = "#FFFF46",
bg_color = "#2F2F29",
line_color = "#000000"
select_color = "#FCB232";

// Width of wedges
var pie = d3.layout.pie()
.sort(null)
.value(function(d) { return 1;} );

// HoverText
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([0, 0])
.html(function(d) {
	return d.data.label + ": <span style='color:white'>" + d.data.value + "</span>";
});

// Calculate fill
var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(function (d) { 
	return (radius - innerRadius) * (d.data.value / 100.0) + innerRadius; 
});

var outlineArc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(radius);

var svg = d3.select("#aster-chart").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

// Import Data
function start(year, muni) {
	$.ajax({
		'url': "http://assemblio.github.io/kosovo-mosaic-visualizer/data/output" + year + ".json",
		'dataType': 'json',
		'responseJSON': 'data',
		'success': function (data) {
			convert_data(data, muni);
		}
	});
};

// Convert data from JSON to required format
function convert_data(data, muni) {
	//Select data for municipality
	muni_data = data[muni];
	
	//Loop through and convert to required format	
	var json_string = "["
	for (var key in muni_data) {
		json_string = json_string + '{' + '"label":"' + key.replace(/Satisfaction with /g, "") + '", "value":' + muni_data[key] + '},'
	};
	
	//Fix end of string
	json_string = json_string.replace(/,$/g, "]")
	
	//Convert to JSON
	var modified_data = JSON.parse(json_string)
	var sorted_data = sortByKey(modified_data, "value");
	console.log(sorted_data.reverse());
	create(modified_data);
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// Create chart
function create(data) {
	
	// Background
	var outerPath = svg.selectAll(".outlineArc")
	.data(pie(data))
	.enter().append("path")
	.attr("fill", d3.rgb(bg_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("class", "outlineArc")
	.attr("d", outlineArc);  
	
	// Wedges
	var path = svg.selectAll(".solidArc")
	.data(pie(data))
	.enter().append("path")
	.attr("fill", d3.rgb(wedge_color))
	.attr("class", "solidArc")
	.attr("stroke", d3.rgb(line_color))
	.attr("d", arc)
	.on('click', select_wedge)
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);

};

// What happens when a wedge is clicked
function select_wedge(d){
	// Remove old text
	svg.selectAll("text").remove()
	
	//Reset Colors
	svg.selectAll(".solidArc")
	.attr("fill", d3.rgb(wedge_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
	
	// Text placed in the middle
	svg.append("svg:text")
	.attr("class", "aster-score")
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.text(d.data.value + " %");
	
	//Color selected wedge
	d3.select(this)
	.attr("fill", d3.rgb(select_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
};

