import PageObject from '../PageObject';

class RegisterFormPageObject extends PageObject {

    get nameField() {
        return cy.get('[name="name"]');
    }

    get surnameField() {
        return cy.get('[name="surname"]');
    }

    get emailField() {
        return cy.get('[name="email"]');
    }

    get passwordField() {
        return cy.get('[name="password"]');
    }

    get confirmPasswordField() {
        return cy.get('[name="confirmPassword"]');
    }

    get agreeRegisterCheckbox() {
        return cy.get('data-testid="CheckBoxOutlineBlankIcon"');
    }

    get registerBtn() {
        return cy.get('#loginBtn').contains('Зареєструватись')
    }

    get seePassIcon() {
        return cy.get('[data-testid="VisibilityIcon"]')
    }

    get alreadyRegisteredLink() {
        return cy.get('.modal-link-btn').contains('Уже з нами?')
    }

    get resetPassLink() {
        return cy.get('.modal-link-btn').contains('Забули пароль?')
    }

    get closeModal() {
        return cy.get('[data-testid="CloseIcon"]')
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

    clickClosModal() {
        this.closeModal.click();
    }
}

export default RegisterFormPageObject;