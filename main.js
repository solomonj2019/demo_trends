
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

let chart;
let chartWidth;
let chartHeight;



let xScale;
let yScale;
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        activeVerse: 3,
        activeLines: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        activeVerse: 5,
        activeLines: [1, 2, 3, 4, 5, 6, 7, 8]
    }
]


let keyframeIndex = -1;

function resetAllColors(){
    svg.selectAll(".bar")
    .transition()
    .duration(500)
    .attr("fill", "#006513");
}


function drawKeyframe(kfi) {
    let kf = keyframes[kfi];

    resetActiveLines();
    updateActiveVerse(kf.activeVerse);

    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }

    resetAllColors();

    // We need to check if their is an svg update function defined or not
    if(kf.svgUpdate){
        // If there is we call it like this
        kf.svgUpdate();
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




// TODO write a function to reset any active lines
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

const width = 500;
const height = 400;

// Define the svg itself as a global variable
let svg = d3.select("#svg");

function initialiseSVG() {
    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");
}
// Initialise two global variables to store the data when it is loaded
let roseChartData;
let violetChartData;

// You have to use the async keyword so that javascript knows that this function utilises promises and may not return immediately
async function loadData() {
    // Because d3.json() uses promises we have to use the keyword await to make sure each line completes before moving on to the next line
    await d3.json("../../assets/data/rose_colours.json").then(data => {
        // Inside the promise we set the global variable equal to the data being loaded from the file
        roseChartData = data;
    });

    await d3.json("../../assets/data/violet_colours.json").then(data => {
        violetChartData = data;
    });
}

function makeRedBarHoverable() {
    // Select the bar associated with the "red" value
    const redBar = chart.select(".bar").filter(d => d.colour === "Red");

    // Add a mouseover event listener
    redBar.on("mouseover", () => {
        d3.selectAll(".red-span").classed("red-text", true); //This will select all elements with the class name "red-span" not just one.
    });

};

function makeWordHoverable(){
    d3.selectAll(".red-span").on("mouseover", () => highlightColour("Red", "red"))
    d3.selectAll(".red-span").on("mouseout", () => highlightColour("Red", "#006513"))
    d3.selectAll(".purple-span").on("mouseover", () => highlightColour("Purple", "purple"))
    d3.selectAll(".purple-span").on("mouseout", () => highlightColour("Purple", "#006513"))
}

// Now that we are calling an asynchronous function in our initialise function this function also now becomes async
function makeRedClickable() {
    d3.select(".red-span").on("click", () => highlightColour("Red", "red"));
}


function highlightRedWord(){
    d3.selectAll(".red-span").classed("red-text", true)
}

function resetWordColor(){
    d3.selectAll(".red-span").classed("red-text", false)
}

let clicked = false;
function makeRedBarClickable(){

    d3.selectAll(".bar")
    .filter(d => d.colour === "Red")
    .on("click", function() {
        if (!clicked) {
            highlightRedWord();
            clicked = true;
        }
        else{
            resetWordColor();
            clicked = false;
        }
    });
    
}

async function initialise() {

    await loadData();
    initialiseSVG();
    drawKeyframe(keyframeIndex);
    // Call the new function when we initialise the page
    makeWordHoverable();

}

initialise();
