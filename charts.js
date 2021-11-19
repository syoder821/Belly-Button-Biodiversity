function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(samplesResultArray);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResults = samplesResultArray[0];
    //console.log(sampleResults);
    // Get metadata, filter desired sample, create variable to hold first sample in array
    var metadata = data.metadata;
    var metadataResultArray = metadata.filter(sampleobj => sampleobj.id == sample);
    var metadataResults = metadataResultArray[0];
    //console.log(metadataResults);
    
    
    // 6. Create variables that hold the otu_ids, otu_labels, sample_values, and wash frequency.
  
    
    var otuIds = sampleResults.otu_ids;
    var otuLabels = sampleResults.otu_labels;
    var sampleValues = sampleResults.sample_values;
    var wfreq = parseFloat(metadataResults.wfreq);
   

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var topTen = otuIds.slice(0,10).reverse();
    var yticksTemp = topTen.map(String);
    var yticks = yticksTemp.map(i => "OTU " + i);
    
    var xticks = sampleValues.slice(0,10).reverse();
    //console.log(yticks);
    //console.log(xticks);
   
    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      orientation: "h",
      // text: otuLabels.slice(0,10).reverse(),
      y: yticks,
      x: xticks,
      name: "OTU"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",

     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    var otuIds = sampleResults.otu_ids;
    var otuLabels = sampleResults.otu_labels;
    var sampleValues = sampleResults.sample_values;

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var guageData = [
      {
      type: "indicator",
      mode: "gauge+number",      
      title: { text: "Belly Button Washing Frequency <br> Scrubs per Week"},
      value: wfreq,
      gauge: {
        axis: { range: [null, 10.00], tickwidth: 1, tickclolor: "black"},
        bar: { color: "black"},
        steps: [
          { range: [0,2], color: "red"},
          { range: [2,4], color: "orange"},
          { range: [4,6], color: "yellow"},
          { range: [6,8], color: "lightgreen"},
          { range: [8,10], color: "green"}
        ]
      }
    }     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      font: { color: "black", family: "Arial"}
      
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", guageData, gaugeLayout);

  });
}

