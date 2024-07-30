import PageObject from '../PageObject';

class CommonPage extends PageObject {

    get nameField() {
        return cy.get('[name="name"]');
    }

    get textField() {
        return cy.get('[name="text"]');
    }

    get addMediaBtn() {
        return cy.get('[data-testid="AddIcon"]');
    }

    get loginBtn() {
        return cy.get('button').contains('Відправити');
    }

    get seePassIcon() {
        return cy.get('[data-testid="VisibilityIcon"]');
    }

    get createLink() {
        return cy.get('.modal-link-btn').contains('Створити обліковий запис');
    }

    get resetPassLink() {
        return cy.get('.modal-link-btn').contains('Забули пароль?');
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

export default CommonPage;