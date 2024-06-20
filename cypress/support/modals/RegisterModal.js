import PageObject from '../PageObject';

class RegisterModal extends PageObject {

    get nameField() {
        return cy.get('[name="name"]');
    }

    get surnameField() {
        return cy.get('[name="surname"]');
    }

    get nicknameField() {
        return cy.get('[name="nickname"]');
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

    typeName(name) {
        this.nameField.type(name, { force: true });
    }


    typeSurname(surName) {
        this.surnameField.type(surName, { force: true });
    }

    typeEmail(email) {
        this.emailField.type(email, { force: true });
    }

    typeNickname(nickname) {
        this.nicknameField.type(nickname, { force: true });
    }

    typePassword(password) {
        this.passwordField.type(password, { force: true });
    }

    typeConfirmPassword(confirmPassword) {
        this.confirmPasswordField.type(confirmPassword, { force: true });
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

    agreeRegisterCheckbox() {
        cy.get('input[type="checkbox"]').check({force: true});
    }

    clickOnRegisterButton() {
        cy.get('#loginBtn').contains('Зареєструватись').click({force: true});
    }
}

export default RegisterModal;