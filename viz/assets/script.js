// COUNTY COLORING FUNCTION
var COLORS = ['e51212', 'e5b530', '36e612', '25b375', '0e45b3', '5e25b3', 'b20e60', 'b20e0e', 'b28d25', '2ab30e', '1b8054', '0a3180', '431b80', '7f0a45', '7f0a0a', '7f651b', '1e800a', '4ee6a4', '306de6', '8b4ee6', 'e5308b', 'e53030', 'e5bd4e', '4ee630', '3db37f', '2554b3', '6c3db3', 'b2256c', 'b22525', 'b2933d', '3db325', '2b805b', '1b3c80', '4d2b80', '7f1b4d', '7f1b1b', '7f692b', '67e64e', '12e6d7', '4e81e6', 'b412e6', 'e64e9a', 'e54e4e', 'd0e612', '50b33d', '0eb3a8', '3d64b3', '8c0eb3', 'b33d78', 'b23d3d', 'a2b30e', '39802b', '0a8078', '2b4780', '640a80', '802b55', '7f2b2b', '74800a', '12e63d', '4ee6db', '1912e6', 'bb30e6', 'e5122f', 'e56012', 'd6e64e', '0eb32f', '3db3ab', '140eb3', '9225b3', 'b20e24', 'b24b0e', 'a7b33d', '0a8022', '2b807a', '0e0a80', '681b80', '7f0a1a', '7f350a', '77802b', '30e654', '12a6e6', '3630e6', 'c24ee6', 'e53048', 'e57330', '83e612', '25b342', '0e81b3', '2a25b3', '973db3', 'b22538', 'b25925', '66b30e', '1b802f', '0a5c80', '1e1b80', '6c2b80', '7f1b28', '7f401b', '49800a', '4ee66c', '30afe6', '534ee6', 'e612c9', 'e54e62', 'e5864e', '91e630', '3db354', '2588b3', '413db3', 'b30e9d', 'b23d4c', 'b2683d', '71b325', '2b803c', '1b6180', '2e2b80', '801b72', '7f2b37', '7f4a2b', '50801b', '12e68a', '4eb8e6', '6712e6', 'e64ed1', 'e5ad12', '9fe64e', '0eb36b', '3d8fb3', '500eb3', 'b33da3', 'b2870e', '7cb33d', '0a804d', '2b6680', '390a80', '802b74', '7f600a', '58802b', '30e697', '1259e6', '7930e6', 'e5127c']

var countyColor = function (county, state, results) {
  if (checkCluster(county, state, results.representatives)) {
    return 'black';
  }
  for (var i = 0; i < results.clusters.length; i++) {
    if (checkCluster(county, state, results.clusters[i])) {
      return '#' + COLORS[i] + 'aa';
    }
  }
  if (checkCluster(county, state, results.skipped)) {
    return '#eeeeeeaa';
  }
  return 'white';
}

// LAYOUT
var margin = { top: 0, right: 0, bottom: 0, left: 0 };
var width = 1200 - margin.right - margin.left;
var height = 800;

// HELPER FUNCTIONS
var showCaption = function (data) {
  var name = [data.properties.name, data.properties.state].join(', ');
  d3.select('#caption').html(name);
}
var resetCaption = function () {
  d3.select('#caption').html('Hover over a county...');
}
var checkCluster = function (county, state, cluster) {
  for (i = 0; i < cluster.length; i++) {
    if ((county.toLowerCase() == cluster[i][0].toLowerCase()) && (state.toLowerCase() == cluster[i][1].toLowerCase())) {
      return true;
    }
  }
  return false;
}
var q = queue()
    .defer(d3.json, "./assets/json/counties.json")
    .defer(d3.json, "./assets/json/states.json")
    .defer(d3.json, "./assets/json/results.json")
    .await(ready);
    
// SETUP SCRIPT
function ready(error, countylines, statelines, results) {
  if (error) throw error;
  d3.select('#loading').remove(); // remove the loading text
  resetCaption();
  
  // COPY STATES INTO COUNTIES
  var stateIds = {};
  statelines.features.forEach(function (stateline) {
    stateIds[stateline.id] = stateline.properties.name;
  });
  countylines.features.forEach(function (countyline) {
    countyline.properties.state = stateIds[countyline.id.slice(0,2)];
  })
  
  // DRAW MAP
  var map = d3.select('#map').append('svg')
    .style('width', width)
    .style('height', height);
  var counties = map.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(countylines.features)
    .enter().append('path')
    .attr('d', d3.geo.path())
    .style('fill', function (data) {
      return countyColor(data.properties.name, data.properties.state, results);
    });
  var states = map.append('g')
    .attr('class', 'states')
    .selectAll('path')
    .data(statelines.features)
    .enter().append('path')
    .attr('d', d3.geo.path());
    
  // HOVER LISTENERS
  counties.on('mouseover', showCaption)
    .on('mousemove', showCaption)
    .on('mouseout', resetCaption);
};