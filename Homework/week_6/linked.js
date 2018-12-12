/* Data Processing
 * Daan Molleman
 * 11275820
 * Linked baseball View
 */

/* Interacivity source : https://www.competa.com/blog/how-create-tooltips-in-d3-js/
                     By: Maria Cristina Di Termine */

// world series history stats
wsh = "data1.json"
// last season team stats
laststats = "data2.json"

d3.select("head").append("title").text("Linked views - Daan Molleman")
d3.select("body").append("h1").text("Linked views")
d3.select("body").append("h2").text("Daan Molleman - 11275820")
d3.select("body").append("p").text("this stacked bar chart shows the amount of \
                                    wins and losses in the world series for each\
                                    MLB team from 1903 to 2017")
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
            .style("background-color", "#d0dce5") //#F8E5D7 // #bac5d1
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
      window.laststats = data
      drawPie("Boston_Redsox")
      drawLogo()
  })
}

function createScales(set1) {
  /* Create scales */
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
  /* Draw the bar chart*/

  // create rect for quick access
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
            .html("<div id='thumbnail'><span>" + d["team"].replace("_", " ") + "\n" + d["wins"] + "</div>")
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
       .on("click", function(d) {
          userInput = d["team"]
          updatePie(userInput)
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
         .on("click", function(d) {
            userInput = d["team"]
            updatePie(userInput)
         })

         // keep the tooltip above the mouse when mouse is on bar
         .on("mousemove", function(d) {
            d3.select(this)
            myTool
              .html("<div id='thumbnail'><span>" + d["team"].replace("_", " ") + "\n" + d["losses"] + "</div>")
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

  // insert text and rects for legend
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
  /* Draw the donut graph
     The first data shown is for the Red Sox, since they won the first and
     also the last iteration of the world series */

  // declare the selectd data and chart properties
  var data = laststats[userInput],
      r = 300,
      color = ["red","blue","orange","green"];
      statNames = Object.keys(data)

  // create a group for the chart segments
  group = svg2.append("g")
              .attr("transform", "translate(400,400)")
              .attr("class", "group");

  // insert a title
  svg2.append("text")
      .attr("transform", "translate(100,100)")
      .attr("class", "pieTitle")
      .text(userInput.replace("_", " "))

  arc = d3.arc()
          .innerRadius(200)
          .outerRadius(r)

  pie = d3.pie()
          .padAngle(.01)
          .value(function(d) { return data[d] });

  // bind data and append a group for each segment
  var arcs = group.selectAll("arc")
              .data(pie(statNames))
              .enter()
                .append("g")
                .attr("class","arc")
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
                     .html("<div id='thumbnail'><span>" + d.value + "</div>")
                     .style("left", (d3.event.pageX - 60) + "px")
                     .style("top", (d3.event.pageY - 40) + "px")
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

  // draw arcs
  arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {return color[i]})
        .attr("stroke", "black");

  // label each donut segment
  arcs.append("text")
        .attr("transform",function(d) {return "translate(" + arc.centroid(d) + ")";})
        .attr("class", "label")
        .text(function(d) { return d.data} );
}

function drawLogo() {
  /* Draw the logo of the team */
  userInput = "Boston_Redsox"
  var imgs = svg2.append("image")
                .attr("xlink:href", "http://www.capsinfo.com/images/MLB_Team_Logos/" + userInput + ".png")
                .attr("x", "310")
                .attr("y", "300")
                .attr("width", "200")
                .attr("height", "200");
}

function updatePie(userInput) {
  /* update the pie graph according to user selection */

  svg2.selectAll("image")
      .attr("xlink:href", "http://www.capsinfo.com/images/MLB_Team_Logos/" + userInput + ".png")

  svg2.selectAll(".pieTitle")
      .text(userInput.replace("_", " "))

  var data = laststats[userInput],
      r = 300,
      color = ["red","blue","orange","green"];
      statNames = Object.keys(data)

  pie = d3.pie()
          .padAngle(.01)
          .value(function(d) { return data[d] });

  // rescale segments
  group.selectAll("path")
               .data(pie(statNames))
               .transition()
               .attr("d", arc)

  // label each donut segment
  arcs.selectAll(".label")
        .transition()
        .duration(300)
        .attr("transform",function(d) {return "translate(" + arc.centroid(d) + ")";})
        .text(function(d) { return d.data} );
}
