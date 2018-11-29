// Daan Molleman
// 11275820
// Scatterplot
// api = application programming interface

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
// var womenInScience = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/msti.json"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
// var consConf = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/consconf.json"

var requests = [d3.json(womenInScience), d3.json(consConf)];
const baseYear = 2007

window.onload = function() {
  // request api
  Promise.all(requests).then(function(response) {
      console.log(response)
      let womenValues = parseData(response[0]);
      let consValues = parseData(response[1]);
      console.log(womenValues)
      let joined = []
      
  });
}

function parseData(data) {
    let values = []
    let sleutels = Object.keys(data["dataSets"][0]["series"])
    sleutels.forEach(function(i) {
      let keys = Object.keys(data["dataSets"][0]["series"][i]["observations"])
      keys.forEach(function(j) {
        let year = (Number(j) + baseYear)
        let value = data["dataSets"][0]["series"][i]["observations"][j][0]
        let dataPoint = {year:year, value:value}
        values.push(dataPoint)
      })
    })
    return values
}
