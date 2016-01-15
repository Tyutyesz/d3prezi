/**
 * Created by dev on 2016. 01. 07..
 */
var width = 900;
var height = 600;
var margin = {top: -5, right: -5, bottom: -5, left: -5};
var projection = d3.geo.mercator();

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var svg = d3.select(".svg-place").append("svg")
   // .attr("width", width)
   // .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + 520 )
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);
var path = d3.geo.path()
    .projection(projection);
var g = svg.append("g");

var div = d3.select(".svg-place").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("raw.json", function(error, topology) {
    g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .on("mouseover", function(d, i) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("id: " + topojson.object(topology, topology.objects.countries).geometries[i].id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

        .attr("id", function(d, i)
        {
            return topojson.object(topology, topology.objects.countries).geometries[i].id
        })
        .attr("style", function(d, i)
        {
            if(topojson.object(topology, topology.objects.countries).geometries[i].id == 348){
                return "fill: #C65D57"
            }
        })
        .attr("d", path);
    console.log(topojson.object(topology, topology.objects.countries).geometries);
});
function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}