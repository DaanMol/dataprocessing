// Daan Molleman
// 11275820
// Scatterplot
// api = application programming interface

var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var harmUnemp = "https://stats.oecd.org/SDMX-JSON/data/KEI/LR+LRHUTTTT.FRA+DEU+KOR+NLD+PRT+GBR.ST.A/all?startTime=2007&endTime=2015"

var requests = [d3.json(womenInScience), d3.json(consConf), d3.json(harmUnemp)];

// define width and height of the svg
const w = 1000;
const h = 450;
const dotPadding = 70;
const xPadding = 70;
const padding = 40
const colours = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']

d3.select("head").append("title").text("D3 Scatterplot - Daan Molleman")
d3.select("body").append("h1").text("D3 Scatterplot").style("font-family", "Monospace")
d3.select("body").append("h2").text("Daan Molleman - 11275820")
                 .style("font-family", "Monospace")
d3.select("body").append("p").text("This chart shows the correlation between \
                                    the percentage of women working in science\
                                    and the consumer confidence in a certain year")
                 .style("font-family", "Monospace")
d3.select("body").append("p").text("The colour of the dots represents the \
                                    employment rate")
                 .style("font-family", "Monospace")
d3.select("body").append("h4").text("source: OECD (2018)")
                 .style("font-family", "Monospace")

window.onload = function() {

  // request api
  Promise.all(requests).then(function(response) {
      console.log(response)
      let womenValues = parseData(response[0]);
      let consValues = parseData(response[1]);
      let unempValues = parseData(response[2]);

      d3.select("#userInput").on("input", function() {
        update(womenValues, consValues, unempValues, this.value)
      })

      defaultInput = "France"

      // select the proper country from each parsed dataset
      userSelection1 = womenValues[countries1.indexOf(defaultInput)][defaultInput]
      userSelection2 = consValues[countries2.indexOf(defaultInput)][defaultInput]
      userSelection3 = unempValues[countries1.indexOf(defaultInput)][defaultInput]

      // instead of creating dots for the unemployment, create a simple array
      unemployment = [];
      for (i in userSelection3) {
        unemployment.push(userSelection3[i][years[i]])
      }

      // create the dots to be plotted in the scatterplot
      dots = makeDots(userSelection1, userSelection2);

      // create scales
      createScale(userSelection1, userSelection2, userSelection3);

      // initialise svg variable
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

      // insert circles
      var circles = svg.selectAll("circle")
                       .data(years)
                       .enter()
                       .append("circle")
                       .attr("cx", function(d) {
                           return xScale(dots[d][0]);
                       })
                       .attr("cy", function(d) {
                           return yScale(dots[d][1]);
                       })
                       .attr("r", 5)
                       .style("fill", function(d, i) {
                          return lScale(userSelection3[i][String(d)])
                       })
                       .attr("class", "normal");

      // create the tags for the years
      var tags = svg.selectAll("text")
                     .data(years)
                     .enter()
                     .append("text")
                     .text(function(d) { return d; })
                     .attr("x", function(d) {
                        return xScale(dots[d][0]) + 10;
                     })
                     .attr("y", function(d) {
                        return yScale(dots[d][1]);
                     })
                     .attr("class", "tag")

      // draw country name atop graph
      svg.selectAll(".country")
         .data(defaultInput)
         .enter()
         .append("text")
         .attr("x", 20)
         .attr("y", 20)
         .attr("class", "country")
         .text(defaultInput)

      // draw the scales for the graph
      drawScales(svg);

      // creat the legend
      var svg = d3.select("svg")

      // select space to draw legend
      svg.append("g")
         .attr("class", "legendQuant")
         .attr("transform", "translate(855,200)")

      // create legend object
      var legend = d3.legendColor()
                      .labelFormat(d3.format(".2f"))
                      .title("Uneployment rate")
                      .shapePadding(5)
                      .shapeWidth(50)
                      .shapeHeight(20)
                      .labelOffset(12)
                      .titleWidth(100)
                      .scale(lScale)

      // draw the legend
      svg.select(".legendQuant")
        .call(legend);
  });
}

function parseData(data) {
    // declare global year and country list for user selection
    // create separate lists since the countries in the
    // datasets are formatted differently

    // the datasets are formatted differently, so check for proper formatting
    if (data.structure.dimensions.series.length === 2) {
      format = 1 //women
      window.countries1 = [];
    } else if (data.structure.dimensions.series.length === 4) {
      format = 1 // unemployment
    } else {
      format = 0 //cons
      window.countries2 = [];
    }

    // retrieve the countries from the dataset
    countryIndex = Object.keys(data.structure.dimensions.series[format].values)
    countryIndex.forEach(function(i) {
      if (format === 1) {
          countries1.push(data.structure.dimensions.series[format].values[i].name)
      } else {
          countries2.push(data.structure.dimensions.series[format].values[i].name)
      }
    })

    // create global year array for future use
    window.years = [];

    // retrieve the years from the dataset
    yearData = Object.keys(data.structure.dimensions.observation[0].values)
    yearData.forEach(function(i) {
      years.push(data.structure.dimensions.observation[0].values[i].id)
    })
    var values = [];

    // extract the object of country objects
    let countryData = Object.keys(data.dataSets[0].series)

    // loop over each county's observations and create array of data objects
    countryData.forEach(function(i) {
        let obs = Object.keys(data.dataSets[0].series[i].observations);

        // the country 'number' is differently formatted in each dataset
        if (i.length === 3 || i.length === 7) {
            country = countries1[i[2]]
        } else {
            country = countries2[i[0]]
        }

        // create emty country datalist
        let countryYears = [];
        // create datapoints and add them to the values list //j is year index
        obs.forEach(function(j) {
            let year = years[j];
            let value = data.dataSets[0].series[i].observations[j][0];
            countryYears.push({[years[j]]:value})
        })
        values.push({[country]:countryYears})
    })
    return values
}

function makeDots(set1, set2) {
  /* combine values in array of objects */
  dotList = {};
  for (i in set1) {
      year = Object.keys(set1[i])[0]
      for (j in set2) {

          // only use years if both datasets have them
          if (Object.keys(set1[i])[0] === Object.keys(set2[j])[0]) {
              dotList[year] = [set1[i][Object.keys(set1[i])[0]],
                               set2[j][Object.keys(set2[j])[0]]]}
          }
      }
  return dotList
}

function createScale(set1, set2, set3) {
  /* create scale for x, y and third variable*/
  window.xScale = d3.scaleLinear()
                 .domain([calc(set1, "min") - 1,
                          calc(set1, "max") + 1])
                 .range([xPadding, w - padding]);
  window.yScale = d3.scaleLinear()
                 .domain([calc(set2, "min") - 1,
                          calc(set2, "max") + 1])
                 .range([h-padding, padding]);
  window.lScale = d3.scaleQuantize()
                    .domain([calc(set3, "min"),
                             calc(set3, "max")])
                    .range(colours)
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

function drawScales(svg) {
    /* draw x and y scale */
    // call x-axis
    svg.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       // .attr("id", "xaxis")
       .call(d3.axisBottom(xScale));

    // create x axis label
    svg.append("text")
       .attr("y", h - 20)
       .attr("x", w / 2)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .style("font-family", "Monospace")
       .text("Percentage of women in science");

    // call y-axis ticks
    svg.append("g")
       .attr("class", "yaxis")
       .attr("transform", "translate(" + xPadding + ",0)")
       // .attr("id", "yaxis")
       .call(d3.axisLeft(yScale));

    // create y axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x",0 - (h / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .style("font-family", "Monospace")
       .text("consumer confindence");
}

function update(womenValues, consValues, unempValues, selection) {
    /* updates data to a selected country */

    updateValues1 = womenValues[countries1.indexOf(selection)][selection]
    updateValues2 = consValues[countries2.indexOf(selection)][selection]
    updateValues3 = unempValues[countries1.indexOf(selection)][selection]

    // calculate new dots
    newDots = makeDots(updateValues1, updateValues2)

    // calculate new scale
    createScale(updateValues1, updateValues2, updateValues3);

    // select data to change
    var svg = d3.select("body");

    // make changes
    svg.selectAll(".normal")
            .data(years)
            .transition()
            .duration(750)
            .attr("cx", function(d) {
                if (newDots.hasOwnProperty(String(d))) {
                    return xScale(newDots[d][0])
                } else {
                    return 2000
                }
            })
            .attr("cy", function(d) {
                if (newDots.hasOwnProperty(String(d))) {
                    return yScale(newDots[d][1])
                } else {
                    return 2000
                }
            })
            .style("fill", function(d, i) {
               return lScale(updateValues3[i][String(d)])
            });

    // update tags
    svg.selectAll(".tag")
       .data(years)
       .transition()
       .duration(750)
       .attr("x", function(d) {
           if (newDots.hasOwnProperty(String(d))) {
               return xScale(newDots[d][0]) + 10
           } else {
               return 2000
           }
       })
       .attr("y", function(d) {
           if (newDots.hasOwnProperty(String(d))) {
               return yScale(newDots[d][1])
           } else {
               return 2000
           }
       })

    // update the legend with a new scale
    var legend = d3.legendColor()
                   .labelFormat(d3.format(".2f"))
                   .title("Uneployment rate")
                   .shapePadding(5)
                   .shapeWidth(50)
                   .shapeHeight(20)
                   .labelOffset(12)
                   .titleWidth(100)
                   .scale(lScale)

    // draw the legend
    svg.select(".legendQuant")
       .call(legend);

    // update country name atop graph
    svg.selectAll(".country")
       .text(selection);

   svg.selectAll(".xaxis")
      .transition()
      .duration(750)
      .call(d3.axisBottom(xScale));

   svg.selectAll(".yaxis")
      .transition()
      .duration(750)
      .call(d3.axisLeft(yScale));
}
