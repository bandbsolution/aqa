import { defineConfig } from 'cypress';

export default defineConfig({
    watchForFileChanges: false,
    defaultCommandTimeout: 6000,
    experimentalMemoryManagement: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
    numTestsKeptInMemory: 50,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'results',
        overwrite: false,
        html: false,
        json: true,
    },
    e2e: {
        experimentalOriginDependencies: true,
        baseUrl: process.env.NODE_ENV === 'prod' ? 'http://localhost:8080' : 'https://dev.bonfairplace.com/ua',
        setupNodeEvents(on, config) {
            const viewportWidth = config.env.VIEWPORT_WIDTH || 1920;
            const viewportHeight = config.env.VIEWPORT_HEIGHT || 1080;

            return {
                ...config,
                viewportWidth: parseInt(viewportWidth as string, 10),
                viewportHeight: parseInt(viewportHeight as string, 10),
            };
        },
        env: {
            MAILSLURP_API_KEY: '',
            baseApiUrl: process.env.NODE_ENV === 'prod' ? 'http://localhost:8080' : 'https://dev.bonfairplace.com/v1/',
            GOOGLE_USERNAME: '',
            GOOGLE_PASSWORD: '',
        },
        supportFile: 'cypress/support/e2e.js',
        experimentalRunAllSpecs: true,
    },
});
