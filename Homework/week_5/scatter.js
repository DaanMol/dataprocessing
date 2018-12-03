// Daan Molleman
// 11275820
// Scatterplot
// api = application programming interface

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
// var womenInScience = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/msti.json"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
// var consConf = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/consconf.json"

var requests = [d3.json(womenInScience), d3.json(consConf)];

// define width and height of the svg
const w = 1000;
const h = 450;
const dotPadding = 70;
const xPadding = 50;
const padding = 30

d3.select("head").append("title").text("D3 bar chart - Daan Molleman")
d3.select("body").append("h1").text("D3 bar chart").style("font-family", "Monospace")
d3.select("body").append("h2").text("Daan Molleman - 11275820")
                 .style("font-family", "Monospace")
d3.select("body").append("p").text("This chart shows the correlation between \
                                    the percentage of women working in science\
                                    and the consumer confidence in a certain year")
                 .style("font-family", "Monospace")
d3.select("body").append("h4").text("source: OECD (2018)")
                 .style("font-family", "Monospace")

window.onload = function() {
  // request api
  Promise.all(requests).then(function(response) {
    console.log(response)
      let womenValues = parseData(response[0]);
      let consValues = parseData(response[1]);

      userInput = "Portugal"
      console.log(womenValues)
      console.log(consValues)
      // console.log(countries.indexOf(userInput))
      // console.log("yes")
      userSelection1 = womenValues[countries1.indexOf(userInput)][userInput]
      userSelection2 = consValues[countries2.indexOf(userInput)][userInput]
      // console.log(userSelection1)
      // console.log(userSelection2)

      dots = makeDots(userSelection1, userSelection2);

      // create scales
      var xScale = d3.scaleLinear()
                     .domain([calc(userSelection1, "min") - 1,
                              calc(userSelection1, "max") + 1])
                     .range([xPadding, w - padding])
      var yScale = d3.scaleLinear()
                     .domain([calc(userSelection2, "min") - 1,
                              calc(userSelection2, "max") + 1])
                     .range([h-padding, padding]);

      // initialise svg variable
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

      // insert circles
      svg.selectAll("circle")
         .data(dots)
         .enter()
         .append("circle")
         .attr("cx", function(d, i) {
             return xScale(d[Object.keys(d)][0]);
         })
         .attr("cy", function(d, i) {
             return yScale(d[Object.keys(d)][1]);
         })
         .attr("r", 5)
         .attr("class", "normal");

      // insert circle tags
      svg.selectAll("text")
         .data(dots)
         .enter()
         .append("text")
         .text(function(d) {
            return Object.keys(d)[0];
         })
         .attr("x", function(d) {
            return xScale(d[Object.keys(d)][0]) + 10;
         })
         .attr("y", function(d) {
            return yScale(d[Object.keys(d)][1]);
         })

      // call x-axis ticks
      svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0," + (h - padding) + ")")
         .call(d3.axisBottom(xScale));

      // create y axis label
      svg.append("text")
         .attr("y", h - 10)
         .attr("x", w / 2)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .style("font-family", "Monospace")
         .text("Percentage of women in science");

      // call y-axis ticks
      svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + xPadding + ",0)")
         .call(d3.axisLeft(yScale));

      // create y axis label
      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -5)
         .attr("x",0 - (h / 2))
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .style("font-family", "Monospace")
         .text("consumer confindence");
  });
}

function parseData(data) {
    // declare global year and country list for user selection
    // create separate lists since the countries in the
    // datasets are formatted differently

    // the datasets are formatted differently, so check for proper formatting
    if (data.structure.dimensions.series.length === 2) {
      format = 1 //women
      set = 0
      window.countries1 = [];
    } else {
      format = 0 //cons
      set = 1
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
        if (i.length === 3) {
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
  // combine values in array of arrays
  // use womenValues length because it holds less dates
  // this way there no missing data
  dotList = [];
  for (i in set1) {
      year = Object.keys(set1[i])[0]
      dotList.push({[year]:[set1[i][year], set2[i][year]]})
  }
  return dotList
}

function calc(set, stat) {
    // calculate a min or max from an array of objects
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

// france, netherlands, portugal, germany, united kingdom, korea
