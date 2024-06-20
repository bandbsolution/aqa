import PageObject from '../PageObject';

class LoginModal extends PageObject {

    get emailField() {
        return cy.get('[name="email"]');
    }

    get passwordField() {
        return cy.get('[name="password"]');
    }

    get loginBtn() {
        return cy.get('#loginBtn').contains('Увійти')
    }

    get seePassIcon() {
        return cy.get('[data-testid="VisibilityIcon"]')
    }

    get createLink() {
        return cy.get('.modal-link-btn').contains('Створити обліковий запис')
    }

    get resetPassLink() {
        return cy.get('.modal-link-btn').contains('Забули пароль?')
    }

    typeEmail(email) {
        this.emailField.type(email, { force: true });
    }

    typePassword(password) {
        this.passwordField.type(password, { force: true });
    }

    clickOnSeePassIcon() {
        this.seePassIcon.click();
    }

    clickOnLoginBtn() {
        this.loginBtn.click();
    }

    clickOnCreateAcc() {
        this.createLink.click();
    }

    clickOnResetPass() {
        this.resetPassLink.click();
    }

}

export default LoginModal;