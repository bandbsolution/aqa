import PageObject from '../PageObject';

class SupportPage extends PageObject {

    get subjectField() {
        return cy.get('[name="subject"]');
    }

    get emailField() {
        return cy.get('[name="contact"]');
    }

    get textField() {
        return cy.get('[name="text"]');
    }

    get nameField() {
        return cy.get('[name="name"]');
    }

    typeSubject(subject) {
        this.subjectField.type(subject, { force: true });
    }

    typeEmail(email) {
        this.emailField.type(email, { force: true });
    }

    typeText(text) {
        this.textField.type(text, { force: true });
    }

    typeName(name) {
        this.nameField.type(name, { force: true });
    }

    assertSendEmailToSupport() {
        cy.contains('Запит надіслано!');
        cy.contains('Наша команда підтримки обробить його та зв’яжеться з вами.');
        cy.contains('Дякуємо за зворотній зв’язок!');
    }

    clickOnNackivatiPyatamyButton() {
        cy.get('button').contains('Накивати п’ятами').click();
        this.assertUrl(Cypress.config('baseUrl'));
    }

    clickOnSendEmailToSupportButton() {
        cy.get('button').contains('Відправити').click();
    }

}

export default SupportPage;