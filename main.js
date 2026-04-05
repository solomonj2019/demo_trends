const svg = d3.select("svg");
const infoChart = d3.select("#info-chart");
const countryTitle = d3.select("#country-name");
let geoData, projection, color;



//add interaction with poem
let keyframes = [
    //we want good text
    {
      activeVerse: 0,
      activeLines: [0],
      textUpdate:{
          goodText: "Click The -> Button To Start",
          bcg:"beige",
          badText: ""
        }
    },

    {
        activeVerse: 1,
        activeLines: [1],
        textUpdate:{
          goodText: "In 2024, 934,727 migrants moved from Honduras to the United States searching for the rolling hills...",
          badText: ""
        },
        svgUpdate: () => highlightCountry("HND", "olive")
    },
    { 
        activeVerse: 1,
        activeLines: [2, 3, 4, 5, 6, 7],
        textUpdate:{
          img:"assets/hillside.png",
          firstImg: true,
          bcg:"beige",
          badText: ""
        }
    },
    { //good text
        activeVerse: 2,
        activeLines: [1, 2, 3],
        textUpdate:{
          img:"assets/hillside.png",
          firstImg: false,
          bcg:"beige",
          badText: ""
        }
    },
    { //change background color
      activeVerse: 2,
      activeLines: [4, 5],
      textUpdate:{
        firstImg: false,
        bcg: "maroon",
        img:"assets/hillside.png",
        badText: "",
        bcg:"maroon"
      }
    },
    { //change photo
      activeVerse: 2,
      activeLines: [6],
      textUpdate: {
        firstImg: true,
        img: "assets/imgBad.png",
        badText: "",
        bcg:"maroon"
      }
    },
    { //change text
      activeVerse: 2,
      activeLines: [7],
      textUpdate: {
        firstImg: false,
        img: "assets/imgBad.png",
        badText: "In 2025, 6,850 have been apprehended by ICE, including deportation.",
        bcg: "maroon"
      },
      svgUpdate: () => highlightUSA("Red")
    },

    //back to good (delete text and change to good color)
    {
        activeVerse: 3,
        activeLines: [1],
        textUpdate:{
          firstImg:true,
          img: "assets/hillside.png", 
          goodText: "In 2024, 1,298,936 migrants from Guatemala travelled to the United States searching for a better quality of life...",
          bcg: "beige",
          badText: ""
        },
        svgUpdate: () => {
          unhighlightCountry("HND");
          highlightCountry("GTM", "olive");
          unhighlightUSA();
        }
    },
        {
        activeVerse: 3,
        activeLines: [2],
        textUpdate:{
          firstImg:false,
          img: "assets/hillside.png", 
          bcg: "maroon",
          badText: ""
        }
    },
    //update text to new country
    {
      activeVerse: 3,
      activeLines: [3, 4],
        textUpdate:{
          firstImg: true,
          img: "assets/imgBad.png", 
          bcg: "maroon",
          badText: ""
        }
    },
    //update to good text (photo)
    {
      activeVerse:3,
      activeLines:[5, 6, 7],
      textUpdate:{
          firstImg:false,
          img: "assets/imgBad.png", 
          bcg: "maroon",
          badText: "In 2025, 11,522 were deported by ICE"
        },
        svgUpdate: () => highlightUSA("Red")
    },
    //TODO: add info for all countries
    {
      activeVerse:4,
      activeLines:[1, 2, 3, 4, 5],
      textUpdate:{
        img:"assets/hillside.png",
        firstImg: true,
        goodText: "In 2024, millions of Central and South American Immigrants travelled to the United States in search of a better life",
        badText: "",
        bcg:"beige"
      },
      svgUpdate: () => {
        highlightUSA("gold")
        unhighlightCountry("GTM")
        highlightCountry("ARG", "olive");
        highlightCountry("BOL", "olive");
        highlightCountry("BRA", "olive");
        highlightCountry("CHL", "olive");
        highlightCountry("COL", "olive");
        highlightCountry("ECU", "olive");
        highlightCountry("GUY", "olive");
        highlightCountry("PRY", "olive");
        highlightCountry("PER", "olive");
        highlightCountry("SUR", "olive");
        highlightCountry("URY", "olive");
        highlightCountry("VEN", "olive");
        highlightCountry("BLZ", "olive");
        highlightCountry("CRI", "olive");
        highlightCountry("SLV", "olive");
        highlightCountry("GTM", "olive");
        highlightCountry("HND", "olive");
        highlightCountry("MEX", "olive");
        highlightCountry("NIC", "olive");
        highlightCountry("PAN", "olive");
        highlightCountry("ATG", "olive");
        highlightCountry("BHS", "olive");
        highlightCountry("BRB", "olive");
        highlightCountry("CUB", "olive");
        highlightCountry("DMA", "olive");
        highlightCountry("DOM", "olive");
        highlightCountry("GRD", "olive");
        highlightCountry("HTI", "olive");
        highlightCountry("JAM", "olive");
        highlightCountry("KNA", "olive");
        highlightCountry("LCA", "olive");
        highlightCountry("VCT", "olive");
        highlightCountry("TTO", "olive");
      }
    },
      {
      activeVerse:4,
      activeLines:[6, 7],
      textUpdate: {
        bcg: "maroon",
        img:"assets/imgBad.png",
        badText: "Over 50,000 were deported by ICE alone"
      },
      svgUpdate: () => highlightUSA("maroon"),
    },

    {
      activeVerse:5,
      activeLines:[1, 2, 3, 4, 5, 6],
      svgUpdate: () => {
        unhighlightUSA();
        highlightCountry("DOM", "olive");
        highlightCountry("GRD", "olive");
        highlightCountry("HTI", "olive");
        highlightCountry("JAM", "olive");
        highlightCountry("KNA", "olive");
        highlightCountry("LCA", "olive");
        highlightCountry("VCT", "olive");
        highlightCountry("TTO", "olive");
        unhighlightCountry("ARG");
        unhighlightCountry("BOL");
        unhighlightCountry("BRA");
        unhighlightCountry("CHL");
        unhighlightCountry("COL");
        unhighlightCountry("ECU");
        unhighlightCountry("GUY");
        unhighlightCountry("PRY");
        unhighlightCountry("PER");
        unhighlightCountry("SUR");
        unhighlightCountry("URY");
        unhighlightCountry("VEN");
        unhighlightCountry("BLZ");
        unhighlightCountry("CRI");
        unhighlightCountry("SLV");
        unhighlightCountry("GTM");
        unhighlightCountry("HND");
        unhighlightCountry("MEX");
        unhighlightCountry("NIC");
        unhighlightCountry("PAN");
        unhighlightCountry("ATG");
        unhighlightCountry("BHS");
        unhighlightCountry("BRB");
        unhighlightCountry("CUB");
        unhighlightCountry("DMA");
        unhighlightCountry("DOM");
        unhighlightCountry("GRD");
        unhighlightCountry("HTI");
        unhighlightCountry("JAM");
        unhighlightCountry("KNA");
        unhighlightCountry("LCA");
        unhighlightCountry("VCT");
        unhighlightCountry("TTO");
      },
      textUpdate:{
        goodText:"",
        badText:"",
        img:"assets/imgBad.png",
        firstImg: false
      }
    },
    {
      activeVerse:5,
      activeLines:[7, 8],
      textUpdate:{
        goodText: "Immigrants deserve to not live in fear of Ice",
        img:"assets/hillside.png",
        firstImg:"true",
        bcg:"olive",
        //TODO: Implement functionality
        badText:"Click on a country to see ICE deportation statistics"
      },
      updateTxt: `
        <ul>
          <li>Deportation data sourced from https://www.ice.gov/statistics</li>
          <li>Does not include deportations by other federal agencies.</li>
          <li>Migration data sourced from https://hdr.undp.org/data-center</li>
          <li>Quality of life metrics sourced from https://www.un.org/development/desa. </li>
        </ul>
      `

    }
]


function updateTextPannel({goodText, img, textclass, bcg, firstImg, badText}){
  if (goodText !== undefined) d3.select("#good-text").text(goodText)
            .style("opacity", 0)
            .text(goodText)
            .transition()
            .duration(800)
            .style("opacity", 1);

    if (badText !== undefined) d3.select("#bad-text").text(badText)
          .style("opacity", 0)
          .text(badText)
          .transition()
          .duration(800)
          .style("opacity", 1);


  if (img) {
      if (firstImg) {
          d3.select("#hill_img")
              .style("opacity", 0)
              .attr("src", img)
              .style("display", "block")
              .transition()
              .duration(800)
              .style("opacity", 1);
      } else {
          d3.select("#hill_img")
              .attr("src", img)
              .style("display", "block")
              .style("opacity", 1);
      }
    }
    else{

      // no image specified — hide it
      d3.select("#hill_img")
          .transition()
          .duration(800)
          .style("opacity", 0)
          .on("end", () => d3.select("#hill_img").style("display", "none"));

    }


    if (bcg !== undefined) {
        d3.select(".text-panel")
            .transition()
            .duration(800)
            .style("background-color", bcg);
    }


}




let keyframeIndex = 0;


function resetActiveLines() {
  // Reset the active-line class for all of the lines
  d3.selectAll(".line").classed("active-line", false);
}


function scrollLeftColumnToActiveVerse(id) {
    // First we want to select the div that is displaying our text content
    var leftColumn = document.querySelector(".left-column-content");

    // Now we select the actual verse we would like to be centred, this will be the <ul> element containing the verse
    var activeVerse = document.getElementById("verse" + id);

    // The getBoundingClientRect() is a built in function that will return an object indicating the exact position
    // Of the relevant element relative to the current viewport.
    // To see a full breakdown of this read the documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // Now we calculate the exact location we would like to scroll to in order to centre the relevant verse
    // Take a moment to rationalise that this calculation does what you expect it to
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    // Finally we scroll to the right location using another built in function.
    // The 'smooth' value means that this is animated rather than happening instantly
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}

function resetAllColors(){
    svg.selectAll(".bar")
    .transition()
    .duration(500)
    .attr("fill", "#006513");
}

//from hw 4
function drawKeyframe(kfi) {
    console.log("Drawing keyframe", kfi, keyframes[kfi]);
    let kf = keyframes[kfi];

    resetActiveLines();
    updateActiveVerse(kf.activeVerse);

    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }

    if (kf.textUpdate) updateTextPannel(kf.textUpdate);

    resetAllColors();

    // We need to check if their is an svg update function defined or not
    if(kf.svgUpdate){
        // If there is we call it like this
        kf.svgUpdate();
    }

    if(kf.updateTxt){
      dataInfoUpdate(kf.updateTxt);
    }
}


function forwardClicked() {
  // Make sure we don't let the keyframeIndex go out of range
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

function backwardClicked() {
  if (keyframeIndex > 0) {
    keyframeIndex--;
    drawKeyframe(keyframeIndex);
  }
}

function updateActiveVerse(id) {
    // Reset the current active verse - in some scenarios you may want to have more than one active verse, but I will leave that as an exercise for you to figure out
    d3.selectAll(".verse").classed("active-verse", false);

    // Update the class list of the desired verse so that it now includes the class "active-verse"
    d3.select("#verse" + id).classed("active-verse", true);

    // Scroll the column so the chosen verse is centred
    scrollLeftColumnToActiveVerse(id);
}

function updateActiveLine(vid, lid) {
  // Select the correct verse
  let thisVerse = d3.select("#verse" + vid);
  // Update the class list of the relevant lines
  thisVerse.select("#line" + lid).classed("active-line", true);
}


function highlightCountry(country, color){
  let ct = svg.selectAll("path")
  .filter(d => d.properties.iso_a3 == country)

  ct.transition()
    .duration(1000)
    .attr("fill", color)
    .transition()
}

//set back to original color
function unhighlightCountry(country){
  svg.selectAll("path")
  .filter(d => d.properties.iso_a3 == country)
    .transition()
  .attr("fill", d => d.properties.originalColor)
  .duration(1000);

}

//update text in bottom right
function dataInfoUpdate(text) {
  const p = document.getElementById("data-info-panel");
  p.innerHTML = text;
}


function highlightUSA(color) {
  const us = svg.selectAll("path")
    .filter(d => d.properties.iso_a3 === "USA");

  us.transition()
    .duration(1000)
    .attr("fill", color)
    .transition()
}

function unhighlightUSA() {
  const us = svg.selectAll("path")
    .filter(d => d.properties.iso_a3 === "USA");
  us.transition()
    .duration(1000)
    .attr("fill", origina)
    .transition()
}


let origina

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

      //needed to use AI to figure this piece out
    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        const fillColor = d.properties.hdi
          ? color(d.properties.hdi)
          : "#4f4f4f";


        d.properties.originalColor = fillColor;

        return fillColor;
      })
      .attr("stroke", "black")
      .on("mouseover", function(event, d) {
        updateInfoChart(d);
      });

          const us = svg.selectAll("path")
        .filter(d => d.properties.iso_a3 === "USA");
          origina = us.attr("fill");

        
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





function initalizePoem(){
    drawKeyframe(keyframeIndex)
}

function initializeTextPanel() {
    d3.select("#good-text").text("Click The -> Button To Start");
    d3.select("#bad-text").text("");
    d3.select("#hill_img").style("display", "none");
}

initalize_map_2();
initializeTextPanel();
initalizePoem();



document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);





