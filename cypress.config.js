const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://dev.bonfairplace.com/ua',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
