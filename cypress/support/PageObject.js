class PageObject {


    clickOnSupportLinkInFooter() {
        cy.get('.footer-address-text').should('have.attr','href','/ua/support').click();
        this.assertUrl(Cypress.config('baseUrl') + '/support');
        this.assertTitle('Підтримка');
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
        cy.get('#notistack-snackbar')
            .should('be.visible')
            .and('have.text', notificationMessage);
    }

    openLoginModal() {
         cy.get('[data-testid="PermIdentityIcon"]').click();
    }

    openSearchPage() {
        cy.get('[data-testid="SearchIcon"]').click();
        this.assertUrl(Cypress.config('baseUrl') + '/search?question=&type=services');
        this.assertTitle('Пошук');
    }

    closeModal() {
        cy.get('[data-testid="CloseIcon"]').click()
    }

    navigateToMenuItem(menuItem) {
        cy.wait(3000);
        cy.get('[aria-label="Мій профіль"]').click();
        cy.get('p').contains(menuItem).click();
    }

    goToMyProfile() {
        this.navigateToMenuItem('Мій профіль');
    }

    goToMySupport() {
        this.navigateToMenuItem('Підтримка');
    }

    goToMySettings() {
        this.navigateToMenuItem('Налаштування');
    }

    goToMySaved() {
        this.navigateToMenuItem('Збережені');
    }

    goToMyLogout() {
        this.navigateToMenuItem('Вийти');
    }

}

export default PageObject;