const svg = d3.select("svg");
const infoChart = d3.select("#info-chart");
const countryTitle = d3.select("#country-name");
let geoData, projection, color;


async function initalize_map_2(){

  //Michael: I had to use chatGPT for this change
  const [geoData_infcn, csvData] = await Promise.all([
    d3.json("custom.geo.json"),
    d3.csv("data_for_vis/qol.csv")
  ]);

  geoData = geoData_infcn

  //rest is the same before
  const qolMap = new Map(
      csvData.map(d => [
          d.iso3, 
          {
            hdi: +d.hdi_2023,
            le: +d.le_2023,
            eys: +d.eys_2023
          }
      ])
  );

  geoData.features.forEach(d => {
      const value = qolMap.get(d.properties.iso_a3);
      if (value){
          d.properties.hdi = value.hdi;
          d.properties.le = value.le;
          d.properties.eys = value.eys;
      }

    });

    color = d3.scaleSequential()
      .domain([0.5, 0.95]) 
      .interpolator(d3.interpolateBlues);

    projection = d3.geoMercator()
      .fitSize([1000, 600], geoData)
      //recentered the data so that we dont get weird alaska island behavior
      .center([-75, 0]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        return d.properties.hdi
          ? color(d.properties.hdi)
          : "#4f4f4f"; 
      })
      .attr("stroke", "black")
      .on("mouseover", function(event, d) {
        updateInfoChart(d);
      });
    
}

function updateInfoChart(country) {
      countryTitle.text(country.properties.name);

      const data = [
        {label: "Human Development Index: ", value: country.properties.hdi ?? 0, max: 1},
        {label: "Life Expectancy: ", value: country.properties.le ?? 0, max: 90},
        {label: "Expected Years in School: ", value: country.properties.eys ?? 0, max: 20}
      ];

      infoChart.selectAll("*").remove();

      const height = 160;
      const barHeight = height/5;

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.max)])
        .range([0, 300]);


      //need to adjust hdi scale: multiply by 100  
      infoChart.selectAll("text.label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => 35 + i * 45)
        .text(d => d.label);

      infoChart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 250)
        .attr("y", (d, i) => 15 + i * 45)
        //Michael: scale teh hdi by 100* the value (chatgpt for syntax)
        .attr("width", (d, i) => i === 0 ? xScale(d.value*100):xScale(d.value))
        .attr("height", barHeight)
        .attr("fill", "steelblue");

      infoChart.selectAll("text.value")
        .data(data)
        .enter()
        .append("text")
        //Michael: scale change position for the text (again chatgpt for syntax)
        .attr("x", (d, i) => 255+(i == 0 ? xScale(d.value*100):xScale(d.value)))
        .attr("y", (d, i) => 35 + i * 45)
        .text(d => d.value ? d.value.toFixed(2) : "No Data");
    }

initalize_map_2();






