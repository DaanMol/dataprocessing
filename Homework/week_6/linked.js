// Daan Molleman
// 11275820
// Linked baseball View

// world series history stats
wsh = "data1.json"
// last season team stats
laststats = "data2.json"

d3.select("head").append("title").text("Linked views - Daan Molleman")
d3.select("body").append("h1").text("Linked views")
d3.select("body").append("h2").text("Daan Molleman - 11275820")
d3.select("body").append("p").text("this stacked bar chart shows the amount of \
                                    wins and losses in the world series for each\
                                    MLB team since 1903")
d3.select("body").append("a").text("Source: data.world")
                             .attr("href", "https://data.world/throwback-thurs/throwback-thursday-week-32-the-world-series")
d3.select('body').append("h4")

// define width and height
var w = 1000;
var h = 450;
var w2 = 1000;
var h2 = 1000;
var margins = {left:50, right:20, upper:20, lower:20, bars:4}

// create variable for quick tooltip access
var myTool = d3.select("body")
               .append("div")
               .attr("class", "mytooltip")
               .style("opacity", "0")
               .style("display", "none");

// create variable for quick svg acces
var svg = d3.selectAll("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var svg2 = d3.selectAll("body")
             .append("svg")
             .attr("width", w2)
             .attr("height", h2);

// var requests = [d3.json(wsh), d3.json(laststats)];

window.onload = function() {

  // request api
  d3.json(wsh).then(function(data) {
      window.majorleague = data
      createScales(majorleague)
      drawScales()
      drawRect(majorleague)
      drawLegend()
  })

  d3.json(laststats).then(function(data) {
      console.log(data)
      window.laststats = data
      drawPie("Boston")
      drawLogo()
  })
}

function createScales(set1) {
  window.xScale = d3.scaleLinear()
                    .domain([0, Object.values(set1).length])
                    .range([margins.left, w - margins.right]);
  window.yScale = d3.scaleLinear()
                    .domain([0, 40])
                    .range([h-margins.lower, margins.upper]);
}

function calc(set, stat) {
    /* calculate a min or max from an array of objects */
    stats = [];
    for (i in set) {
      stats.push(set[i][Object.keys(set[i])])
    }
    if(stat === "max") {
        return Math.max.apply(null, stats)
    } else {
        return Math.min.apply(null, stats)
    }
}

function drawRect(teams) {

  var rects = svg.selectAll("rect")
                 .data(teams)
                 .enter()
                 .append("rect");

  // draw the bars
  rects.data(teams)
       .attr("x", function(d, i) {
          return xScale(i);
       })
       .attr("y", function(d) {
          return yScale(d['wins'])
       })
       .attr("width", w / teams.length - margins.bars)
       .attr("height", function(d) {
          return h - yScale(d["wins"]) - margins.upper
       })
       .attr("class", "bar")

       /* show tooltip and change colour when mouse is on bar
       the following code comes from the source named atop the doc */
       .on("mouseover", function(d) {
          d3.select(this)
               .style("cursor", "pointer")
               .attr("class", "sel")
               myTool
                 .transition()
                 .duration(300)
                 .style("opacity", "1")
                 .style("display", "block")
       })

       // keep the tooltip above the mouse when mouse is on bar
       .on("mousemove", function(d) {
          d3.select(this)
          myTool
            .html("<div id='thumbnail'><span>" + d["team"] + "\n" + d["wins"] + "</div>")
            .style("left", (d3.event.pageX - 60) + "px")
            .style("top", (d3.event.pageY - 65) + "px")
       })

       // remove tooltip and restore colour
       .on("mouseout", function(d, i) {
          d3.select(this)
            .style("cursor", "normal")
            .attr("class", "bar")
            myTool
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("display", "none")
       })

   var lose = svg.selectAll(".loss")
                  .data(teams)
                  .enter()
                  .append("rect");

    // draw losses
    lose.data(teams)
         .attr("x", function(d, i) {
            return xScale(i);
         })
         .attr("y", function(d, i) {
            return yScale(d['losses']) - (h - yScale(d["wins"]) - margins.lower);
         })
         .attr("width", w / teams.length - margins.bars)
         .attr("height", function(d) {
            return h - yScale(d["losses"]) - margins.upper
         })
         .attr("class", "loss")

         /* show tooltip and change colour when mouse is on bar
         the following code comes from the source named atop the doc */
         .on("mouseover", function(d) {
            d3.select(this)
                 .style("cursor", "pointer")
                 .attr("class", "losssel")
                 myTool
                   .transition()
                   .duration(300)
                   .style("opacity", "1")
                   .style("display", "block")
         })

         // keep the tooltip above the mouse when mouse is on bar
         .on("mousemove", function(d) {
            d3.select(this)
            myTool
              .html("<div id='thumbnail'><span>" + d["team"] + "\n" + d["losses"] + "</div>")
              .style("left", (d3.event.pageX - 60) + "px")
              .style("top", (d3.event.pageY - 65) + "px")
         })

         // remove tooltip and restore colour
         .on("mouseout", function(d, i) {
            d3.select(this)
              .style("cursor", "normal")
              .attr("class", "loss")
              myTool
                .transition()
                .duration(300)
                .style("opacity", "0")
                .style("display", "none")
         })
}

function drawScales() {
    /* draw the x and y scale */

     svg.selectAll("label")
        .data(majorleague)
        .enter()
        .append("text")
        .text(function(d) {
          return d["team"].substring(0,3);
        })
        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", h)
        .attr("class", "label");

    // call y-axis ticks
    svg.append("g")
       .attr("class", "yaxis")
       .attr("transform", "translate(" + margins.left + ",0)")
       .call(d3.axisLeft(yScale));

    // create y axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x",0 - (h / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .style("font-family", "Monospace")
       .text("Number of wins and losses");
}

function drawLegend() {
  /* draw a legend for the bar chart */

  // select space to draw legend
  legend = svg.append("g")
              .attr("class","legend")
              .attr("transform","translate(800,50)")

  legend.append("text")
        .attr("transform","translate(10,0)")
        .text("wins")
  legend.append("text")
        .attr("transform","translate(12,20)")
        .text("losses")
  legend.append("rect")
        .attr("transform","translate(-25,-15)")
        .attr("width", 30)
        .attr("height", 15)
        .attr("class", "bar")
  legend.append("rect")
        .attr("transform","translate(-25, 7)")
        .attr("width", 30)
        .attr("height", 15)
        .attr("class", "loss")
}

function drawPie(userInput) {
  var data = laststats[userInput],
    r = 300,
    color = d3.scaleOrdinal()
           .range(["red","blue","orange"]);

  statNames = Object.keys(data)
  console.log(statNames)

  var group = svg2.append("g")
              .attr("transform", "translate(400,400)");

  var arc = d3.arc()
              .innerRadius(200)
              .outerRadius(r)

  var pie = d3.pie()
            .value(function(d) {
              console.log(data[d])
              return data[d]
            });

  var arcs = group.selectAll("arc")
              .data(pie(statNames)) // binding data to our (update) selection, but we first pass it through our pie layout function
              .enter()
                .append("g") //append a group for each data element
                .attr("class","arc");

  arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) {return color(data[d])})
        .attr("stroke", "black");

  arcs.append("text")
        .attr("transform",function(d) {return "translate(" + arc.centroid(data[d]) + ")";})
        .text(function(d) { return d.data} );

  // console.dir(pie(data));

}

function drawLogo() {
  var imgs = svg2.append("image")
                .attr("xlink:href", "logos/Boston_Redsox.png")
                .attr("x", "310")
                .attr("y", "300")
                .attr("width", "200")
                .attr("height", "200");
}
