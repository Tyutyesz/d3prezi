var title="Login count";
var units=" ";
var breaks=[10,25,50,100];
var colours=["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"];

//general layout information
var cellSize = 17;
var xOffset=20;
var yOffset=60;
var calY=50;//offset of calendar in each group
var calX=25;
var width = 960;
var height = 163;
var parseDate = d3.time.format("%d/%m/%y").parse;
format = d3.time.format("%d-%m-%Y");
toolDate = d3.time.format("%d/%b/%y");

d3.csv("data.csv", function(error, data) {

    //set up an array of all the dates in the data which we need to work out the range of the data
    var dates = new Array();
    var values = new Array();

    //parse the data
    data.forEach(function(d)    {
        dates.push(parseDate(d.date));
        values.push(d.value);
        d.date=parseDate(d.date);
        d.value=d.value;
        d.year=d.date.getFullYear();//extract the year from the data
    });

    var yearlyData = d3.nest()
        .key(function(d){return d.year;})
        .entries(data);

    var svg = d3.select(".svg-place").append("svg")
        .attr("width","90%")
        .attr("viewBox","0 0 "+(xOffset+width)+" 540")

    //title
    svg.append("text")
        .attr("x",xOffset)
        .attr("y",20)
        .text(title);

    //create an SVG group for each year
    var cals = svg.selectAll("g")
        .data(yearlyData)
        .enter()
        .append("g")
        .attr("id",function(d){
            return d.key;
        })
        .attr("transform",function(d,i){
            return "translate(0,"+(yOffset+(i*(height+calY)))+")";
        })

    var labels = cals.append("text")
        .attr("class","yearLabel")
        .attr("x",xOffset)
        .attr("y",15)
        .text(function(d){return d.key});

    //create a daily rectangle for each year
    var rects = cals.append("g")
        .attr("id","alldays")
        .selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(parseInt(d.key), 0, 1), new Date(parseInt(d.key) + 1, 0, 1)); })
        .enter().append("rect")
        .attr("id",function(d) {
            return "_"+format(d);
            //return toolDate(d.date)+":\n"+d.value+" dead or missing";
        })
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return xOffset+calX+(d3.time.weekOfYear(d) * cellSize);
        })
        .attr("y", function(d) { return calY+(d.getDay() * cellSize); })
        .datum(format);

    //create day labels
    var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    var dayLabels=cals.append("g").attr("id","dayLabels")
    days.forEach(function(d,i)    {
        dayLabels.append("text")
            .attr("class","dayLabel")
            .attr("x",xOffset)
            .attr("y",function(d) { return calY+(i * cellSize); })
            .attr("dy","0.9em")
            .text(d);
    })

    //let's draw the data on
    var dataRects = cals.append("g")
        .attr("id","dataDays")
        .selectAll(".dataday")
        .data(function(d){
            return d.values;
        })
        .enter()
        .append("rect")
        .attr("id",function(d) {
            return format(d.date)+":"+d.value;
        })
        .attr("stroke","#ccc")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("x", function(d){return xOffset+calX+(d3.time.weekOfYear(d.date) * cellSize);})
        .attr("y", function(d) { return calY+(d.date.getDay() * cellSize); })
        .attr("fill", function(d) {
            if (d.value<breaks[0]) {
                return colours[0];
            }
            for (i=0;i<breaks.length+1;i++){
                if (d.value>=breaks[i]&&d.value<breaks[i+1]){
                    return colours[i];
                }
            }
            if (d.value>breaks.length-1){
                return colours[breaks.length]
            }
        })

    //append a title element to give basic mouseover info
    dataRects.append("title")
        .text(function(d) { return toolDate(d.date)+":\n"+d.value+units; });

    //add montly outlines for calendar
    cals.append("g")
        .attr("id","monthOutlines")
        .selectAll(".month")
        .data(function(d) {
            return d3.time.months(new Date(parseInt(d.key), 0, 1),
                new Date(parseInt(d.key) + 1, 0, 1));
        })
        .enter().append("path")
        .attr("class", "month")
        .attr("transform","translate("+(xOffset+calX)+","+calY+")")
        .attr("d", monthPath);

    //retreive the bounding boxes of the outlines
    var BB = new Array();
    var mp = document.getElementById("monthOutlines").childNodes;
    for (var i=0;i<mp.length;i++){
        BB.push(mp[i].getBBox());
    }

    var monthX = new Array();
    BB.forEach(function(d,i){
        boxCentre = d.width/2;
        monthX.push(xOffset+calX+d.x+boxCentre);
    })

    //create centred month labels around the bounding box of each month path
    //create day labels
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var monthLabels=cals.append("g").attr("id","monthLabels")
    months.forEach(function(d,i)    {
        monthLabels.append("text")
            .attr("class","monthLabel")
            .attr("x",monthX[i])
            .attr("y",calY/1.2)
            .text(d);
    })

    //create key
    var key = svg.append("g")
        .attr("id","key")
        .attr("class","key")
        .attr("transform",function(d){
            return "translate("+xOffset+","+(yOffset-(cellSize*1.5))+")";
        });

    key.selectAll("rect")
        .data(colours)
        .enter()
        .append("rect")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("x",function(d,i){
            return i*130;
        })
        .attr("fill",function(d){
            return d;
        });

    key.selectAll("text")
        .data(colours)
        .enter()
        .append("text")
        .attr("x",function(d,i){
            return cellSize+5+(i*130);
        })
        .attr("y","1em")
        .text(function(d,i){
            if (i<colours.length-1){
                return "up to "+breaks[i];
            }   else    {
                return "over "+breaks[i-1];
            }
        });

});//end data load

//pure Bostock - compute and return monthly path data for any year
function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
        d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
}

/*Another calendar*/

var widthSec = 960,
    heightSec = 750,
    cellSizeSec = 25; // cell size

var no_months_in_a_row = Math.floor(widthSec / (cellSizeSec * 7 + 50));
var shift_up = cellSizeSec * 3;

var day = d3.time.format("%w"), // day of the week
    day_of_month = d3.time.format("%e") // day of the month
day_of_year = d3.time.format("%j")
week = d3.time.format("%U"), // week number of the year
    month = d3.time.format("%m"), // month number
    year = d3.time.format("%Y"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var svg = d3.select(".svg-place-second").selectAll("svg")
    .data(d3.range(2008, 2011))
    .enter().append("svg")
    //.attr("width", widthSec)
    //.attr("height", heightSec)
    .attr("viewBox", "0 0 " + widthSec + " " + heightSec )
    .attr("class", "RdYlGn")
    .append("g")

var rect = svg.selectAll(".day")
    .data(function(d) {
        return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSizeSec)
    .attr("height", cellSizeSec)
    .attr("x", function(d) {
        var month_padding = 1.2 * cellSizeSec*7 * ((month(d)-1) % (no_months_in_a_row));
        return day(d) * cellSizeSec + month_padding;
    })
    .attr("y", function(d) {
        var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
        var row_level = Math.ceil(month(d) / (no_months_in_a_row));
        return (week_diff*cellSizeSec) + row_level*cellSizeSec*8 - cellSizeSec/2 - shift_up;
    })
    .datum(format);

var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
    .data(function(d) {
        return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("text")
    .text(monthTitle)
    .attr("x", function(d, i) {
        var month_padding = 1.2 * cellSizeSec*7* ((month(d)-1) % (no_months_in_a_row));
        return month_padding;
    })
    .attr("y", function(d, i) {
        var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
        var row_level = Math.ceil(month(d) / (no_months_in_a_row));
        return (week_diff*cellSizeSec) + row_level*cellSizeSec*8 - cellSizeSec - shift_up;
    })
    .attr("class", "month-title")
    .attr("d", monthTitle);

var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
    .data(function(d) {
        return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("text")
    .text(yearTitle)
    .attr("x", function(d, i) { return widthSec/2 - 100; })
    .attr("y", function(d, i) { return cellSizeSec*5.5 - shift_up; })
    .attr("class", "year-title")
    .attr("d", yearTitle);


//  Tooltip Object
var tooltip = d3.select("body")
    .append("div").attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

d3.csv("dji.csv", function(error, csv) {
    var data = d3.nest()
        .key(function(d) { return d.Date; })
        .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
        .map(csv);

    rect.filter(function(d) { return d in data; })
        .attr("class", function(d) { return "day " + color(data[d]); })
        .select("title")
        .text(function(d) { return d + ": " + percent(data[d]); });

    //  Tooltip
    rect.on("mouseover", mouseover);
    rect.on("mouseout", mouseout);
    function mouseover(d) {
        tooltip.style("visibility", "visible");
        var percent_data = (data[d] !== undefined) ? percent(data[d]) : percent(0);
        var purchase_text = d + ": " + percent_data;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(purchase_text)
            .style("left", (d3.event.pageX)+30 + "px")
            .style("top", (d3.event.pageY) + "px");
    }
    function mouseout (d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        var $tooltip = $("#tooltip");
        $tooltip.empty();
    }

});

function dayTitle (t0) {
    return t0.toString().split(" ")[2];
}
function monthTitle (t0) {
    return t0.toLocaleString("en-us", { month: "long" });
}
function yearTitle (t0) {
    return t0.toString().split(" ")[3];
}