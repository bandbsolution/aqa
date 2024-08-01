import { defineConfig } from 'cypress';

export default defineConfig({
    viewportHeight: 1080,
    viewportWidth: 1920,
    watchForFileChanges: false,
    defaultCommandTimeout: 6000,
    experimentalMemoryManagement: true,
    chromeWebSecurity: false,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'results',
        overwrite: false,
        html: false,
        json: true,
    },
    e2e: {
        baseUrl: 'https://dev.bonfairplace.com/ua',
        setupNodeEvents() {},
        env: {
            MAILSLURP_API_KEY: 'ef2fac5b48dfa754a70c70e63d31dee02a691c11eb25a47741d687a6430bc39d',
            baseApiUrl: 'https://dev.bonfairplace.com/v1/',
        },
        supportFile: 'cypress/support/e2e.js',
        experimentalRunAllSpecs: true,
    },
});
