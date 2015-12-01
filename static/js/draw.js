
var width = 470,
height = 470,
radius = Math.min(width, height) / 2,
innerRadius = 0.4 * radius;

var screen_resolution = window.screen.availWidth
if (screen_resolution <= 350){
    width = 305
    height = 305
}
// Colors
var wedge_color = "#FFFF46",
bg_color = "#2F2F29",
line_color = "#000000"
select_color = "red";

// Width of wedges
var pie = d3.layout.pie()
.sort(null)
.value(function(d) { return 1;} );

// HoverText
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([0, 0])
.html(function(d) {
	return capitalizeFirstLetter(d.data.label) + ": <span style='color:red'><b>" + d.data.value + "%</b></span>";
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



// Import Data
function start(muni, s_or_d, div, data, sort_by) {
	convert_data(data, muni, div, sort_by);
};

// Convert data from JSON to required format
function convert_data(data, muni, div, sort_by) {
	//Select data for municipality
	muni_data = data;
	
	//Loop through and convert to required format	
	var json_array = []
	for (var key in muni_data) {
		if (!(isNaN(muni_data[key]))){
			var json = {
				"label": key.replace(/Satisfaction with /g, ""),
				"value": Number(muni_data[key].toFixed(1))
			}
			json_array.push(json);
		}
	};
	
	// Sort data by the label
	var sorted_data = sortByKey(json_array, sort_by);
	create(sorted_data.reverse(), div);
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Create chart
function create(data, div) {
	$("#" + div).empty();
	window.svg = d3.select("#" + div).append("svg")
	.attr("id", "aster-chart-svg")
	.attr("style", "margin: 0 auto;")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	svg.call(tip);

	// Background
	var outerPath = svg.selectAll(".outlineArc")
	.data(pie(data))
	.enter().append("path")
	.attr("fill", d3.rgb(bg_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("class", "outlineArc")
    .transition().delay(function (d,i){ return i * 40;}).duration(40)
	.attr("d", outlineArc);  
	
	// Wedges
	var path = svg.selectAll(".solidArc")
	.data(pie(data))
	.enter().append("path")
	.attr("fill", d3.rgb(wedge_color))
	.attr("class", "solidArc")
	.attr("id", function(d) { return slugify(d.data.label); })
	.attr("value", function(d) { return d.data.label; })
	.attr("stroke", d3.rgb(line_color))
	.attr("d", arc)
	.on('click', select_wedge)
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// What happens when a wedge is clicked
function select_wedge(d){
	// Remove old text
	svg.selectAll("text").remove();
	
	//Reset Colors
	svg.selectAll(".solidArc")
	.attr("fill", d3.rgb(wedge_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
	
	// Text placed in the middle
	var fulltext = capitalizeFirstLetter(d.data.label) + " " + d.data.value + "%";
	addDescriptionToAsterChart(d, fulltext, svg);
	
	//Color selected wedge
	d3.select(this)
	.attr("fill", d3.rgb(select_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
};

function addDescriptionToAsterChart(d, fulltext, svg){
	var json_position = {
		0: -38,
		1: -18,
		2: 2,
		3: 22,
		4: 42,
		5: 62,
	}
	var a = fulltext.match(/.{6}\S*|.*/g);
	var index = 0;
	if (a.length <= 2) {
		index = 2;
	} else if (a.length == 3) {
		index = 1;
	} else if (a.length >= 4 && a.length <= 5) {
		index = 1;
	} else {
		index = 0;
	}
	a.forEach(function(entry) {
		svg.append("svg:text")
		.attr("class", "aster-score")
		.attr("dy", json_position[index])
		.attr("text-anchor", "middle")
		.text(entry);
		index = index + 1;
	});

}