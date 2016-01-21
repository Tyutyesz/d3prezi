// Data
var data = [
    { name:"Ireland",  income:53000, life: 78, pop:6378, color: "green"},
    { name:"Norway",   income:73000, life: 87, pop:5084, color: "blue" },
    { name:"Tanzania", income:27000, life: 50, pop:3407, color: "grey" }
];
// Létrehozzuk az SVG konténert
var svg = d3.select("#hook").append("svg")
    .attr("width", 120)
    .attr("height", 120)
    .style("fill", "#D0D0D0");
// SVG elemek kreálása adatból !
svg.selectAll("circle")                  // virtuális körök kreálása
    .data(data)                            // data bind
        .enter()                                 // adatokon végig iterálás
            .append("circle")                      // minden egyes adat sorhoz kreál egy kört
                .attr("id", function(d) { return d.name })           // a körnek megadja a megfelelõ id-t
                .attr("cx", function(d) { return d.income /1000  })  // beállítja a körnek a horizontális pozícióját
                .attr("cy", function(d) { return d.life })           // beállítja a körnek a vertikális pozícióját
                .attr("r",  function(d) { return d.pop /1000 *2 })   // beállítja a kör rádiuszát
                .attr("fill",function(d){ return d.color });         // beállítja a kör színét