// Select the dropdown menu and assign it to a variable
var dropdown = d3.select("#selDataset");

// Load the data from your JSON file
d3.json("https://github.com/Gorbulin1989/belly-button-challenge/blob/main/samples.json").then(function(data) {

  // Get the first subject ID from the names array
  var subjectID = data.names[0];

  // Update the dropdown menu with the available subject IDs
  dropdown.selectAll("option")
    .data(data.names)
    .enter()
    .append("option")
    .text(function(d) { return d; })
    .property("value", function(d) { return d; });

  // Create a function to update the charts based on the selected subject ID
  function updateCharts(subjectID) {

    // Filter the data for the selected subject ID
    var subjectData = data.samples.filter(function(d) { return d.id === subjectID; })[0];

    // Sort the OTUs by sample value and get the top 10
    var otuIDs = subjectData.otu_ids.slice(0, 10).reverse();
    var sampleValues = subjectData.sample_values.slice(0, 10).reverse();
    var otuLabels = subjectData.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    var trace = {
      x: sampleValues,
      y: otuIDs.map(function(d) { return "OTU " + d; }),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };
    var layout = {
      title: "Top 10 OTUs Found in Subject " + subjectID
    };
    Plotly.newPlot("bar", [trace], layout);

    // Create the bubble chart
    var trace2 = {
      x: subjectData.otu_ids,
      y: subjectData.sample_values,
      text: subjectData.otu_labels,
      mode: "markers",
      marker: {
        size: subjectData.sample_values,
        color: subjectData.otu_ids
      }
    };
    var layout2 = {
      title: "All OTUs Found in Subject " + subjectID,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    };
    Plotly.newPlot("bubble", [trace2], layout2);



    // Display the metadata
    var metadata = data.metadata.filter(function(d) { return d.id == subjectID; })[0];
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    Object.entries(metadata).forEach(function([key, value]) {
      metadataPanel.append("p").text(key + ": " + value);
    });
  }

  // Call the updateCharts function with the initial subject ID
  updateCharts(subjectID);

  // Add an event listener to the dropdown menu to update the charts when a new subject is selected
  dropdown.on("change", function() {
    var newSubjectID = dropdown.property("value");
    updateCharts(newSubjectID);
  });

});
