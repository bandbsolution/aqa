const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    baseUrl: 'https://dev.bonfairplace.com/ua/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
   // browser: 'chrome',
  },
});
