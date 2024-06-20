describe('create service with valid data', () => {
    before(() => {
        cy.createUser('first');
        cy.activateAccount('firstUserEmail');
        cy.login('firstUserEmail','firstUserPassword');
    });

    after(() => {
        cy.deleteAccount('firstUserPassword');
    });

    it('create service and validate', () => {
        cy.createPost();
        cy.createService();
    });
});
