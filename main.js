const path = require("path");

const chart2image = require("./chart2image.js");
const chart1 = require("./chart1.js");

chart2image({
  chartConfig: chart1,
  saveToFile: "chart.png",
  templatePath: "file://" + path.resolve(__dirname, "template.html"),
  domElementId: "chart",
});
