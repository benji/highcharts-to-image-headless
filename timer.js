module.exports = {
  start: (opName) => {
    const start = new Date().getTime();
    return {
      stopAndLog: () => {
        const stop = new Date().getTime();
        console.log(opName + " took " + (stop - start) + "ms");
      },
    };
  },
};
