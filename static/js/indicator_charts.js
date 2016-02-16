var screen_resolution = window.screen.availWidth;
var allData = getData();

function drawLineChart(div, tab){
	var chartTitle = allData['meta']['chart_title'][tab];
	var yAxis = allData['meta']['y_axis'][tab];

	var rounding = '';
	var legend = false;
	var prefix = allData['meta']['prefix'][tab];
	var suffix = allData['meta']['suffix'][tab];
	
	if (prefix == '_'){
		prefix = '';
	}
	if (suffix == '_'){
		suffix = '';
	} else if (suffix = '%'){
		rounding = 1;
	}
	
	var data = [];
	var i = 1
	for (keyOne in allData[tab]){
		var entry = {};
		var values = [];
		var seriesName = keyOne;
		var indices = allData[tab][keyOne];
		var xAxis = [];
		
		for (keyTwo in indices){
			value = Number(Number(allData[tab][keyOne][keyTwo]).toFixed(rounding));
			
			values.push(value);
			xAxis.push(keyTwo);
		}
		
		entry['name'] = seriesName;
		entry['data'] = values;
		console.log(values);
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
            style: {
                fontFamily: 'Eurostile'
            }
        },
		xAxis: {
			categories: xAxis // list of index values
		},
		yAxis: {
			title: {
				text: yAxis
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#000000'// lookup color value
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
        $("#line-chart-div1").append("<div id='line-chart1' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#line-chart-div2").append("<div id='line-chart2' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
		$("#line-chart-div3").append("<div id='line-chart3' style='margin: auto; min-width: 310px; max-width: 800px; width: 100%; height: 400px;'></div>");
    }
	drawLineChart("line-chart1", '1_2');
	drawLineChart("line-chart2", '1_3');
	drawLineChart("line-chart3", '2_2');
})