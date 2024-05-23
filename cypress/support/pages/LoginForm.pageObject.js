import PageObject from '../PageObject';

class LoginFormPageObject extends PageObject {

    get emailField() {
        return cy.get('[name="email"]');
    }

    get passwordField() {
        return cy.get('[name="password"]');
    }

    get loginBtn() {
        return cy.get('.bonfair_auth_modal-box').contains('Увійти').get('button')
            .should('have.css', 'background-color', 'rgb(239, 201, 56)')
    }

    typeEmail(email) {
        this.emailField.type(email, { force: true });
    }

    typePassword(password) {
        this.passwordField.type(password, { force: true });
    }

    clickOnLoginBtn() {
        this.loginBtn.click();
    }
}

export default LoginFormPageObject;