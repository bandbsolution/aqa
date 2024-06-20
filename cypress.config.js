const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'results',
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    baseUrl: 'https://dev.bonfairplace.com/ua',
    setupNodeEvents(on, config) {

    },
    supportFile: 'cypress/support/e2e.js',
  },
});
