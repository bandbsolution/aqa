class PageObject {
    visit() {
        cy.visit(Cypress.config('baseUrl'));
    }

    assertAllert(alertMessage) {
        cy.on('window:alert', (alert) => {
            expect(alert).to.eq(alertMessage);
        });
    }
}

export default PageObject;