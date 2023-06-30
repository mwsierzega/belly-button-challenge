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
      var panel = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      panel.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  // 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
      var metaArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var firstSample = samplesArray[0];
        var firstMeta = metaArray[0]
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = firstSample.otu_ids;
      var otu_labels = firstSample.otu_labels;
      var sample_values = firstSample.sample_values;
  
      var wfreq = firstMeta.wfreq;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otu_ids.slice(0, 10).map(otu_ids=> 'OTU' + otu_ids).reverse();
  
      // 8. Create the trace for the bar chart. 
      var barChart = [{
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
            color: "#85C1E9"  // Change the color here
        }
      }];
  
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: {
          text: "Top 10 Bacteria Cultures <br> That Were Found",
          font: {
            family: "Courier"
          }
        },
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        },
        plot_bgcolor: "#F5EEF8",  // Change the background color
        paper_bgcolor: "#F5EEF8", // Change the background color
        font: {
            family: "Courier",
            size:14  // Change the font family for the labels here
    }
      };

      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barChart, barLayout);
  
      // 1. Create the trace for the bubble chart.
      var bubbleChart = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Picnic"
        }
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures in Each Sample",
        xaxis: {title: "OTU ID"},
        hovermode: "closest",
        showlegend:false,
        plot_bgcolor: "#F5EEF8",  // Change the background color
        paper_bgcolor: "#F5EEF8", // Change the background color
        font: {
            family: "Courier",
            size:14  // Change the font family for x-axis labels here
          }
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleChart, bubbleLayout); 
  
      // 4. Create the trace for the gauge chart.
     var gaugeChart = [{
       domain: {x: [0,1], y: [0,1]},
       value: wfreq,
       title: {text: "The Washing Frequency for Belly Buttons <br> (Number of Scrubs per Week)",
        font: {family: "Courier", size:18}},
       type: "indicator",
       mode: "gauge+number",
       gauge: {
         axis: {range: [null,10]},
         bar: {color: "white"},
         steps: [
           {range: [0,2], color: "#EC7063"},
           {range: [2,4], color: "#EB984E"},
           {range: [4,6], color: "#F9E79F"},
           {range: [6,8], color: "#82E0AA"},
           {range: [8,10], color: "#16A085"}]
          }
        }];
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        width: 500,
        height: 300,
        plot_bgcolor: "#F5EEF8",  // Change the background color
        paper_bgcolor: "#F5EEF8", // Change the background color
      };
      
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
    });
  }