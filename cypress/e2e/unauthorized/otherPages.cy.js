import MainPage from "../../support/pages/MainPage";
import AuthModals from "../../support/modals/AuthModals";

const mainPage = new MainPage;
const authModals = new AuthModals();
describe('access unauthorized user to pages', () => {
    it('unauthorized cant see order page', () => {
        cy.visit(Cypress.config('baseUrl') + '/order-page/RTx9M48BRfYMw94T2FYv');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })

    it('unauthorized cant see message page', () => {
        cy.visit(Cypress.config('baseUrl') + '/messages');
        cy.url().should('eq', Cypress.config('baseUrl'));
    })
})