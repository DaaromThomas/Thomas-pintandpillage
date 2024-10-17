const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}", // This pattern includes all spec files in the tests/e2e/ folder
  },
});
