
var width = 500,
height = 480
// var margin = {top: 40, right: 80, bottom: 40, left: 120};

var screen_resolution = window.screen.availWidth;
if (screen_resolution <= 480){
    width = 310
    height = 330
} 

var radius = Math.min(width, height) / 2
innerRadius = 0.36 * radius;

// Colors
var wedge_color = "#FFFF46",
bg_color = "#2F2F29",
line_color = "#000000"
select_color = "red";

// Width of wedges
var pie = d3.layout.pie()
.sort(null)
.value(function(d) { return 4;} );

// HoverText
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([0, 0])
.html(function(d) {
	if (municipalities_data.hasOwnProperty(d.data.label)) {
		return capitalizeFirstLetter(municipalities_data[d.data.label][language]) + ": <span style='color:red'><b>" + d.data.value + "%</b></span>";
	} else {
		return capitalizeFirstLetter(indicators_data[d.data.label]["name_" + language]) + ": <span style='color:red'><b>" + d.data.value + "%</b></span>";
	}
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
function start(muni, s_or_d, div, data, sort_by, language, type) {
	convert_data(data, muni, div, sort_by, language, type);
};

// Convert data from JSON to required format
function convert_data(data, muni, div, sort_by, language, type) {
	//Select data for municipality
	muni_data = data;
	
	//Loop through and convert to required format	
	var json_array = []
	for (var key in muni_data) {
		if (!(isNaN(muni_data[key]))){
			var json = {
				"label": key,
				"value": Number(muni_data[key].toFixed(1))
			}
			json_array.push(json);
		}
	};
	
	// Sort data by the label
	var sorted_data = sortByKey(json_array, sort_by);
	create(sorted_data.reverse(), div, language, type);
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
function create(data, div, language, type) {
	types = {
		"municipality": municipalities_data,
		"kosovo-level": indicators_data
	}
	var lang = "";
	if (type == "municipality") {
		lang = language
	} else {
		lang = "name_" + language
	}

	$("#" + div).empty();
	window.svg = d3.select("#" + div).append("svg")
	.attr("id", "aster-chart-svg")
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
    .transition().delay(function (d,i){ return i * 40;})
	.attr("d", outlineArc);


	// Wedges
	var path = svg.selectAll(".solidArc")
	.data(pie(data))
	.enter()
	.append("g")

	path
	.append("path")
	.attr("fill", d3.rgb(wedge_color))
  	.style("fill-rule", "evenodd")
	.attr("class", "solidArc")
	.attr("id", function(d) { return slugify(d.data.label); })
	.attr("value", function(d) { return d.data.label; })
	.attr("stroke", d3.rgb(line_color))
	.attr("d", arc)
	.on('click', select_wedge)
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide)
    .each(stash);

  path.append("svg:text")
    .text(function(d) { 
    	if (types[type].hasOwnProperty(d.data.label)) {
    		return reduceIndicatorsText(types[type][d.data.label][lang]);
    	} else {
    		return reduceIndicatorsText(d.data.label);
    	}
    })
    .classed("label", true)
    .attr("x", function(d) { return d.x; })
    .attr("text-anchor", "middle")
    // translate to the desired point and set the rotation
    .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")" +
                   "rotate(" + getAngle(d) + ")";
    })
    // .attr("dx", "-16") // margin
    .attr("dy", ".35em") // vertical-align
    .attr("pointer-events", "none");
};

function getAngle(d) {
    // Offset the angle by 90 deg since the '0' degree axis for arc is Y axis, while
    // for text it is the X axis.
    var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
    // If we are rotating the text by more than 90 deg, then "flip" it.
    // This is why "text-anchor", "middle" is important, otherwise, this "flip" would
    // a little harder.
    return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
}

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// What happens when a wedge is clicked
function select_wedge(d){
	// Remove old text

	$( ".aster-score" ).each(function(){
		$(this).remove();
	})
	// for(var i = 0, l = spans.length; i < l; i++){
	// 	console.log(spans[i])
	//     spans[i].remove()
	// }
	// $('g').last().find(".aster-score").remove();
	// svg.selectAll("text").remove();
	
	//Reset Colors
	svg.selectAll(".solidArc")
	.attr("fill", d3.rgb(wedge_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
	
	// Text placed in the middle
	if (municipalities_data.hasOwnProperty(d.data.label)) {
		var fulltext = capitalizeFirstLetter(municipalities_data[d.data.label][language]) + " " + d.data.value + "%";
	} else {
		var fulltext = capitalizeFirstLetter(indicators_data[d.data.label]['name_' + language]) + " " + d.data.value + "%";
	}
	addDescriptionToAsterChart(d, fulltext, svg);
	
	//Color selected wedge
	d3.select(this)
	.attr("fill", d3.rgb(select_color))
	.attr("stroke", d3.rgb(line_color))
	.attr("stroke-width", "1");
};

function reduceIndicatorsText(text){
	if (text.length > 10){
		return text.substring(0, 10) + "...";	
	} else {
		return text;
	}
}

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