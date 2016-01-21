// Data
var data = [
    { name:"Ireland",  income:53000, life: 78, pop:6378, color: "green"},
    { name:"Norway",   income:73000, life: 87, pop:5084, color: "blue" },
    { name:"Tanzania", income:27000, life: 50, pop:3407, color: "grey" }
];
// L�trehozzuk az SVG kont�nert
var svg = d3.select("#hook").append("svg")
    .attr("width", 120)
    .attr("height", 120)
    .style("fill", "#D0D0D0");
// SVG elemek kre�l�sa adatb�l !
svg.selectAll("circle")                  // virtu�lis k�r�k kre�l�sa
    .data(data)                            // data bind
        .enter()                                 // adatokon v�gig iter�l�s
            .append("circle")                      // minden egyes adat sorhoz kre�l egy k�rt
                .attr("id", function(d) { return d.name })           // a k�rnek megadja a megfelel� id-t
                .attr("cx", function(d) { return d.income /1000  })  // be�ll�tja a k�rnek a horizont�lis poz�ci�j�t
                .attr("cy", function(d) { return d.life })           // be�ll�tja a k�rnek a vertik�lis poz�ci�j�t
                .attr("r",  function(d) { return d.pop /1000 *2 })   // be�ll�tja a k�r r�diusz�t
                .attr("fill",function(d){ return d.color });         // be�ll�tja a k�r sz�n�t