var screen_resolution = window.screen.availWidth;
var allData = getData();
var lineColor = '#000000'
var font = 'Helvetica'

function drawLineChart(div, tab){
	var chartTitle = allData['meta']['chart_title'][tab];
	var yAxis = allData['meta']['y_axis'][tab];
	var background = allData['meta']['bg_color'][tab];
	var rounding = allData['meta']['rounding'][tab];
	var legend = false;
	
	// Get Suffixes and Prefixes
	var prefix = allData['meta']['prefix'][tab];
	var suffix = allData['meta']['suffix'][tab];
	if (prefix == '_'){
		prefix = '';
	}
	if (suffix == '_'){
		suffix = '';
	}
	
	// Get values for charts
	var data = [];
	var lineColors = [];
	var i = 1;
	
	for (keyOne in allData[tab]){
		var entry = {};
		var values = [];
		var colName = 'line_color_';
		var seriesName = keyOne;
		var indices = allData[tab][keyOne];
		var xAxis = [];
		colName = colName.concat(i);
		
		// Ensure keys are sorted correctly
	    var keys = [];
	    var k, j, len;

	  	for (k in indices) {
	    	if (indices.hasOwnProperty(k)) {
				keys.push(k);
	    	}
		}
			
		keys.sort();
		len = keys.length;
		
		// Cycle through keys in order
		for (j = 0; j < len; j++) {
		  	k = keys[j];
			value = Number(Number(indices[k]).toFixed(rounding));	
			values.push(value);
			xAxis.push(k);
		}
		
		// Get meta data
		entry['name'] = seriesName;
		entry['data'] = values;
		entry['color'] = allData['meta'][colName][tab];
		data.push(entry);
		
		// Check if Legend is needed (i.e. there is more than 1 series)
		if (i > 1){
			legend = true;
		}
		i = i + 1;
	}
	
	$('#' + div).highcharts({
		title: {
			text: chartTitle, // Chart text from meta data
			x: 0 //center
		},
        chart: {
			backgroundColor: background, // Background color
            style: {
                fontFamily: font
            }
        },
		xAxis: {
			lineColor: lineColor,
			tickColor: lineColor,
			categories: xAxis, // list of index values
			labels: {
				style: {
					color: lineColor
				}
			}
		},
		yAxis: {
			title: {
				text: yAxis,
				style: {
					color: lineColor
				}
			},
			labels: {
				style: {
					color: lineColor
				}
			},
			gridLineColor: lineColor,
			gridLineDashStyle: 'ShortDot',
			plotLines: [{
				value: 0,
				width: 1,
			}]
		},
		tooltip: {
			valuePrefix: prefix,
			valueSuffix: suffix
		},
		legend: {
			enabled: legend
		},
		series: data
	});
}

function drawBarChart(div, tab, stacked){
	var chartTitle = allData['meta']['chart_title'][tab];
	var yAxis = allData['meta']['y_axis'][tab];
	var background = allData['meta']['bg_color'][tab];
	var rounding = allData['meta']['rounding'][tab];
	var legend = false;
	
	// Get Suffixes and Prefixes
	var prefix = allData['meta']['prefix'][tab];
	var suffix = allData['meta']['suffix'][tab];
	if (prefix == '_'){
		prefix = '';
	}
	if (suffix == '_'){
		suffix = '';
	}
	
	// Determine if columns are stacked
	var chartType = null;
	if (stacked) { 
		chartType = 'normal';
	}
	
	// Get values for charts
	var data = [];
	var lineColors = [];
	var i = 1;
	
	for (keyOne in allData[tab]){
		var entry = {};
		var values = [];
		var colName = 'line_color_';
		var seriesName = keyOne;
		var indices = allData[tab][keyOne];
		var xAxis = [];
		colName = colName.concat(i);
		
		// Ensure keys are sorted correctly
	    var keys = [];
	    var k, j, len;

	  	for (k in indices) {
	    	if (indices.hasOwnProperty(k)) {
				keys.push(k);
	    	}
		}
			
		keys.sort();
		len = keys.length;
		
		// Cycle through keys in order
		for (j = 0; j < len; j++) {
		  	k = keys[j];
			value = Number(Number(indices[k]).toFixed(rounding));	
			values.push(value);
			xAxis.push(k);
		}
		
		entry['name'] = seriesName;
		entry['data'] = values;
		entry['color'] = allData['meta'][colName][tab];
		data.push(entry);
		
		// Check if Legend is needed (i.e. there is more than 1 series)
		if (i > 1){
			legend = true;
		}
		i = i + 1;
	}

	$('#' + div).highcharts({
		title: {
			text: chartTitle, // Chart text from meta data
			x: 0 //center
		},
        chart: {
			type: 'column',
			backgroundColor: background, // Background color
            style: {
                fontFamily: font
            }
		},
		plotOptions: {
		            series: {
		                stacking: chartType
		            }
		},
		xAxis: {
			lineColor: lineColor,
			tickColor: lineColor,
			categories: xAxis, // list of index values
			labels: {
				style: {
					color: lineColor
				}
			}
		},
		yAxis: {
			title: {
				text: yAxis,
				style: {
					color: lineColor
				}
			},
			labels: {
				style: {
					color: lineColor
				}
			},
			gridLineColor: lineColor,
			gridLineDashStyle: 'ShortDot',
			plotLines: [{
				value: 0,
				width: 1,
			}]
		},
		tooltip: {
			valuePrefix: prefix,
			valueSuffix: suffix
		},
		legend: {
			enabled: legend
		},
		series: data
	});
}

$(document).ready(function(){
    $("#line-chart-div").empty();
    if (screen_resolution <= 480){
        $("#line-chart-div").append("<div id='line-chart1' style='margin: auto; width: 320px; height: 350px;'></div>");
    } else if (screen_resolution > 480 && screen_resolution < 1200) {
        $("#line-chart-div").append("<div id='line-chart1' style='margin: auto; min-width: 310px; max-width: 550px; width: 100%; height: 300px;'></div>");
    } else {
        $("#chart-div1-1").append("<div id='chart1-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div1-2").append("<div id='chart1-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div1-3").append("<div id='chart1-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div2-1").append("<div id='chart2-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div2-2").append("<div id='chart2-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div3-1").append("<div id='chart3-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div3-2").append("<div id='chart3-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div3-3").append("<div id='chart3-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div3-4").append("<div id='chart3-4' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div4-1").append("<div id='chart4-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div4-2").append("<div id='chart4-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div4-3").append("<div id='chart4-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div5-1").append("<div id='chart5-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div5-2").append("<div id='chart5-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div5-3").append("<div id='chart5-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div6-1").append("<div id='chart6-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div6-2").append("<div id='chart6-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div6-3").append("<div id='chart6-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div7-1").append("<div id='chart7-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div7-2").append("<div id='chart7-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div7-3").append("<div id='chart7-3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div7-4").append("<div id='chart7-4' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div8-1").append("<div id='chart8-1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#chart-div8-2").append("<div id='chart8-2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
    }
	
	// Draw Charts
	drawLineChart('chart1-1', '1_1');
	drawLineChart('chart1-2', '1_2');
	drawLineChart('chart1-3', '1_3');
	drawLineChart('chart2-1', '2_1');
	drawLineChart('chart2-2', '2_2');
	drawLineChart('chart3-1', '3_1');
	drawLineChart('chart3-2', '3_2');
	drawLineChart('chart3-3', '3_3');
	drawBarChart('chart3-4', '3_4', true);
	drawLineChart('chart4-1', '4_1');
	drawLineChart('chart4-2', '4_2');
	drawLineChart('chart4-3', '4_3');
	drawLineChart('chart5-1', '5_1');
	drawBarChart('chart5-2', '5_2', false);
	drawBarChart('chart5-3', '5_3', false);
	drawBarChart('chart6-1', '6_1', true);
	drawBarChart('chart6-2', '6_2', true);
	drawBarChart('chart6-3', '6_3', false);
	drawLineChart('chart7-1', '7_1');
	drawLineChart('chart7-2', '7_2');
	drawBarChart('chart7-3', '7_3', false);
	drawBarChart('chart7-4', '7_4', true);
	drawLineChart('chart8-1', '8_1');
	drawLineChart('chart8-2', '8_2');
})