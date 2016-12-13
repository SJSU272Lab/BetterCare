google.load("visualization", "1", {packages:["geochart"]});
google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
	var data = google.visualization.arrayToDataTable([
		['States', 'Names'],
		['US-CA', 24.2],
		['US-FL', 26.8],
		['US-TX', 32.4],
		['US-NY', 25],
		['US-IL', 30.8],
		['US-VA', 29.2],
		['US-PA', 30],
		['US-CO', 20.2],
		['US-WA', 26.4],
		['US-OH', 29.8],
		['US-NC', 30.1],
		['US-NJ', 25.6],
		['US-GA', 30.7],
		['US-MI', 31.2],
		['US-MD', 28.9],
		['US-AZ', 28.4],
		['US-OR', 30.1],
		['US-MA', 24.3],
		['US-MO', 23.6],
		['US-IN', 31.3],
		['US-TN', 33.8],
		['US-OK', 33.9],
		['US-AL', 35.6],
		['US-WI', 30.7],
		['US-KY', 34.6],
		['US-MN', 26.1],
		['US-SC', 31.7],
		['US-LA', 36.2],
		['US-CT', 25.3],
		['US-UT', 24.5],
		['US-NV', 26.7],
		['US-KS', 34.2],
		['US-IA', 32.1],
		['US-AR', 34.5],
		['US-MS', 35.6],
		['US-NM', 28.8],
		['US-NH', 26.3],
		['US-WV', 35.6],
		['US-ID', 28.6],
		['US-RI', 26],
		['US-NE', 31.4],
		['US-HI', 22.7],
		['US-AK', 34.5],
		['US-ME', 30],
		['US-MT', 23.6],
		['US-DC', 22.1],
		['US-DE', 29.7],
		['US-PR', 29.5],
		['US-ND', 31],
		['US-VT', 25.1],
		['US-SD', 30.4],
		['US-WY', 29],
		['US-AE', 0],
		['US-AP', 0],
		['US-GU', 31.6],
		['US-VI', 29.2],
		['US-AA', 0],
		['US-MP', 35.6],
		['US-AS', 34.5]
	]);

	var options = {
		colorAxis: {
			colors:['ffffff','e8f1f7','f1f6fa','e3eef5','d5e6f1','c8ddec','bad5e8','accde3','9fc4de','91bcda','83b4d5','76acd1','5f9fc9','4891c2','3183ba','1b76b3','17689d','145987','114a71','0d3c5b'],
			values: [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38]
		},
		backgroundColor: 'transparent',
		datalessRegionColor: 'silver',
		defaultColor: 'silver',
		legend:'none',
		region: 'US',
		displayMode: 'region',
		resolution: 'provinces'
	};

	var chart = new google.visualization.GeoChart(document.getElementById('googleMap'));
	chart.draw(data, options);
}