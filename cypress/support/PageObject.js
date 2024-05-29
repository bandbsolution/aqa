class PageObject {

    get footerSupport() {
        return cy.get('.footer-address-text').should('have.attr','href','/ua/support');
    }

    clickOnSupportLinkinFooter() {
        this.footerSupport.click();
    }

    visit() {
        cy.visit(Cypress.config('baseUrl'));
    }

    assertUrl(expectedUrl) {
        cy.url().should('eq', expectedUrl)
    }

    assertTitle(expectedTitle) {
        cy.title().should('eq', expectedTitle)
    }

    assertNotification(notificationMessage) {
        cy.get('#notistack-snackbar', (text) => {
            expect(text).to.eq(notificationMessage);
        });
    }

    openLoginModal() {
         cy.get('[data-testid="PermIdentityIcon"]').click()
    }

    openSearchPage() {
        cy.get('[data-testid="SearchIcon"]').click()
        expect(cy.url()).eq('search?question=&type=services')
    }

    closeModal() {
        cy.get('[data-testid="CloseIcon"]').click()
    }

}

export default PageObject;