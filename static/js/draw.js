var width = 350,
height = 400,
radius = Math.min(width, height) / 2,
innerRadius = 0.3 * radius;

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
function start(year, muni, s_or_d, div) {
	$.ajax({
		'url': "data/clean_data/" + year + s_or_d + ".json",
		'dataType': 'json',
		'responseJSON': 'data',
		'success': function (data) {
			convert_data(data, muni, div);
		}
	});
};

// Convert data from JSON to required format
function convert_data(data, muni, div) {
	//Select data for municipality
	muni_data = data[muni];
	
	//Loop through and convert to required format	
	var json_string = "["
	for (var key in muni_data) {
		if (muni_data[key] != null){
			json_string = json_string + '{' + '"label":"' + key.replace(/Satisfaction with /g, "") + '", "value":' + muni_data[key] + '},'
		}
	};
	
	//Fix end of string
	json_string = json_string.replace(/,$/g, "]")
	
	//Convert to JSON
	var modified_data = JSON.parse(json_string)
	var sorted_data = sortByKey(modified_data, "label");
	create(sorted_data, div);
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
	svg.append("svg:text")
	.attr("class", "aster-score")
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.text(d.data.value + "%");
	
	//Color selected wedge
	d3.select(this)
	.attr("fill", d3.rgb(select_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
	text = "<h4 style='width:100%; height:40px; position:absolute; text-align:left;'>"+ capitalizeFirstLetter(d.data.label) +"</h4>"
	$("#aster-text").empty();
	$("#aster-text").append(text);
	$("#aster-text-popup").empty();
	$("#aster-text-popup").append(text);
};

