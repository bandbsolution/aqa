import MainPage from "../../support/pages/MainPage";
import AuthModals from "../../support/modals/AuthModals";

const mainPage = new MainPage;
const authModals = new AuthModals();
describe('access unauthorized user to pages:', () => {
    it('Order', () => {
        cy.visit(Cypress.config('baseUrl') + '/order-page/RTx9M48BRfYMw94T2FYv');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Message', () => {
        cy.visit(Cypress.config('baseUrl') + '/messages');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Ribbon', () => {
        cy.visit(Cypress.config('baseUrl') + '/ribbon');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Scheduler', () => {
        cy.visit(Cypress.config('baseUrl') + '/scheduler?tab=2');
        cy.url().should('eq', Cypress.config('baseUrl'));

        cy.visit(Cypress.config('baseUrl') + '/scheduler?tab=1&sd=DESC&status=&question=');
        cy.url().should('eq', Cypress.config('baseUrl'));

        cy.visit(Cypress.config('baseUrl') + '/scheduler?tab=3');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('My profile', () => {
        cy.visit(Cypress.config('baseUrl') + '/user-page/7a9ade7a-bd9b-492c-9314-b8571988794d?type=posts');
        cy.url().should('eq', Cypress.config('baseUrl'));

        cy.visit(Cypress.config('baseUrl') + '/user-page/7a9ade7a-bd9b-492c-9314-b8571988794d?type=services');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Service', () => {
        cy.visit(Cypress.config('baseUrl') + '/service/VqzzDJABxBYKLkNZ2LtI');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Post', () => {
        cy.visit(Cypress.config('baseUrl') + '/post/aaBoo5AB7gGFpgLIYnAi');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Saved', () => {
        cy.visit(Cypress.config('baseUrl') + '/saved?type=services');
        cy.url().should('eq', Cypress.config('baseUrl'));

        cy.visit(Cypress.config('baseUrl') + '/saved?type=posts');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('Settings', () => {
        cy.visit(Cypress.config('baseUrl') + '/account-settings');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })
})