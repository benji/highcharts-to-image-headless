const fs = require("fs");
const puppeteer = require("puppeteer");

module.exports = async function (opts) {
  const start = new Date().getTime();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(opts.templatePath);

  const chartDimensions = await page.evaluate(async (opts) => {
    window.setup(opts.chartConfig);

    return {
      width: document.getElementById(opts.domElementId).offsetWidth,
      height: document.getElementById(opts.domElementId).offsetHeight,
    };
  }, opts);

  await page.setViewport({
    width: chartDimensions.width,
    height: chartDimensions.height,
    deviceScaleFactor: 4, // control quality here
  });

  // https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-pagescreenshotoptions
  await page.screenshot({
    path: opts.saveToFile,
    encoding: "binary", // can use base64
    type: "png",
  });

  await browser.close();

  const stop = new Date().getTime();
  const elapsed = parseInt((stop - start) / 100) / 10;
  console.log("Conversion to image took " + elapsed + "ms");

  return chartDimensions;
};
