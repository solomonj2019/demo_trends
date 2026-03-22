// const svg = d3.select("svg");

// d3.json("custom.geo.json").then(data => {
//   const projection = d3.geoMercator()
//     .fitSize([1300, 600], data);

//   const path = d3.geoPath().projection(projection);

//   svg.selectAll("path")
//     .data(data.features)
//     .enter()
//     .append("path")
//     .attr("d", path)
//     .attr("fill", "lightgray")
//     .attr("stroke", "black");

// });


const svg = d3.select("svg");
const infoChart = d3.select("#info-chart");
const countryTitle = d3.select("#country-name");

Promise.all([
  d3.json("custom.geo.json"),
  d3.csv("data_for_vis/qol.csv")
]).then(([geoData, csvData]) => {

  // 1. create lookup: iso3 -> hdi value
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

  // 2. attach value to geojson
  geoData.features.forEach(d => {
    const value = qolMap.get(d.properties.iso_a3);
    if (value){
        d.properties.hdi = value.hdi;
        d.properties.le = value.le;
        d.properties.eys = value.eys;
    }

  });

  // 3. color scale (heatmap)
  const color = d3.scaleSequential()
    .domain([0.5, 0.95])   // min/max HDI roughly
    .interpolator(d3.interpolateBlues);

  // 4. projection
  const projection = d3.geoMercator()
    .fitSize([1000, 600], geoData);

  const path = d3.geoPath().projection(projection);

  // 5. draw map
  svg.selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {
      return d.properties.hdi
        ? color(d.properties.hdi)
        : "#ccc"; // no data
    })
    .attr("stroke", "black")
    .on("mouseover", function(event, d) {
      updateInfoChart(d);
    });

  function updateInfoChart(country) {
    countryTitle.text(country.properties.name);

    const data = [
      { label: "HDI", value: country.properties.hdi ?? 0, max: 1 },
      { label: "Life Exp.", value: country.properties.le ?? 0, max: 90 },
      { label: "Schooling", value: country.properties.eys ?? 0, max: 20 }
    ];

    infoChart.selectAll("*").remove();

    const width = 500;
    const height = 160;
    const barHeight = height/5;

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.max)])
      .range([0, 300]);

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
      .attr("x", 120)
      .attr("y", (d, i) => 15 + i * 45)
      .attr("width", d => xScale(d.value))
      .attr("height", barHeight)
      .attr("fill", "steelblue");

    infoChart.selectAll("text.value")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => 130 + xScale(d.value))
      .attr("y", (d, i) => 35 + i * 45)
      .text(d => d.value ? d.value.toFixed(2) : "N/A");
  }
});