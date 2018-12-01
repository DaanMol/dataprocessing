// Daan Molleman
// 11275820
// Scatterplot
// api = application programming interface

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
// var womenInScience = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/msti.json"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
// var consConf = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/consconf.json"

var requests = [d3.json(womenInScience), d3.json(consConf)];
const countries = ["France", "Netherlands", "Portugal", "Germany",
                 "United Kingdom", "Korea"];
const years = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014",
               "2015"];

window.onload = function() {
  // request api
  Promise.all(requests).then(function(response) {
      let womenValues = parseData(response[0]);
      let consValues = parseData(response[1]);

      dots = makeDots(womenValues, consValues);
      console.log(dots)
  });
}

function parseData(data) {
    // the years start at 2007
    // the countries are labeled 0 through 5
    var baseYear = 2007

    var values = []

    // extract the object of country objects
    let countryData = Object.keys(data["dataSets"][0]["series"])

    // loop over each county's observations and create array of data objects
    countryData.forEach(function(i) {
        let obs = Object.keys(data["dataSets"][0]["series"][i]["observations"]);

        // the country 'number' is differently formatted in each dataset
        if (i.length === 3) {
            country = countries[i[2]]
        } else {
            country = countries[i[0]]
        }

        // create datapoints and add them to the values list
        obs.forEach(function(j) {
            let year = (Number(j) + baseYear);
            let value = data["dataSets"][0]["series"][i]["observations"][j][0];
            let dataPoint = {country:country, year:year, value:value};
            values.push(dataPoint);
      })
    })
    return values
}

function makeDots(set1, set2) {
  // combine values in array of arrays
  // use womenValues length because it holds less dates
  // this way there no missing data
  dotList = [];
  for (i in set1) {
      dotList.push({country:set1[i].country, year:set1[i].year,
                    women:set1[i].value, cons:set2[i].value});
  }
  return dotList
}

// france, netherlands, portugal, germany, united kingdom, korea
