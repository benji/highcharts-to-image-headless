const timer = require("./timer");
const fs = require("fs");
const puppeteer = require("puppeteer");

module.exports = async function (opts) {
  const chart2imageTimer = timer.start("\tchart2image");
  const puppeteerStartupTimer = timer.start("\t\tPuppeteer startup");
  const options = {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
    headless: true,
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  puppeteerStartupTimer.stopAndLog();

  const renderChartTimer = timer.start("\t\tRender chart");
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
    deviceScaleFactor: 2, // control quality here
  });
  renderChartTimer.stopAndLog();

  const screenshotTimer = timer.start("\t\tScreenshot");
  // https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-pagescreenshotoptions
  await page.screenshot({
    path: opts.saveToFile,
    encoding: "binary", // can use base64
    type: "png",
  });
  screenshotTimer.stopAndLog();

  await browser.close();
  chart2imageTimer.stopAndLog();

  return chartDimensions;
};
