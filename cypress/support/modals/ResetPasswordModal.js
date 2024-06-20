import PageObject from '../PageObject';

class ResetPasswordModal extends PageObject {

    get emailField() {
        return cy.get('[name="email"]');
    }

    get continueBtn() {
        return cy.get('#loginBtn').contains('Продовжити')
    }

    get alreadyRegisteredLink() {
        return cy.get('.modal-link-btn').contains('Уже з нами?')
    }

    clickOnCreateAcc() {
        this.createLink.click();
    }

    clickOnResetPass() {
        this.resetPassLink.click();
    }

}

export default ResetPasswordModal;