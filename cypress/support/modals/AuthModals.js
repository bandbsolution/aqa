import PageObject from '../PageObject';

class AuthModals extends PageObject {

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

    get codeField() {
        return cy.get('[name="verify"]');
    }

    typeCode(code) {
        this.codeField.type(code, { force: true });
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
        cy.get('[data-testid="VisibilityIcon"]');
    }

    clickOnAlreadyRegisteredLink() {
        cy.get('.modal-link-btn').contains('Уже з нами?');
    }

    clickOnLoginBtn() {
        cy.get('#loginBtn').contains('Увійти').click();
    }

    clickOnCreateAcc() {
        cy.get('.modal-link-btn').contains('Створити обліковий запис').click();
    }

    clickOnResetPass() {
        cy.get('.modal-link-btn').contains('Забули пароль?').click();
    }

    clickClosModal() {
        cy.get('[data-testid="CloseIcon"]').click();
    }

    agreeRegisterCheckbox() {
        cy.get('input[type="checkbox"]').check({force: true});
    }

    clickOnRegisterButton() {
        cy.get('#loginBtn').contains('Зареєструватись').click({force: true});
    }

    clickOnContinueButton() {
        cy.get('button').contains('Продовжити').click();
    }

    clickOnAgreeButton() {
        cy.get('button').contains('Підтвердити').click();
    }
}

export default AuthModals;