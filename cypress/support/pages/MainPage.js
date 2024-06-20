import PageObject from '../PageObject';

class MainPage extends PageObject {

    clickOnHeaderLogo() {
         cy.get('.header-logo').click();
    }

    clickOnFooterLogo() {
        cy.get('.footer-logo').click();
    }

    validateAdvice1() {
        cy.get('#helpTitle-0').contains('Що таке Social Selling і чому тобі варто почати ним користуватись вже зараз?').click()
        cy.get('#helpDesc-0').contains('Зібрали поради, як краще використовувати всі принади майданчику та просувати свій бізнес. З ними вам буде простіше орієнтуватися та створювати послуги для збільшення кількості замовлень. ')
    }

    validateAdvice2() {
        cy.get('#helpTitle-1').contains('Як користуватися сервісом і отримувати більше прибутку і задоволення?').click()
        cy.get('#helpDesc-1').contains('Зібрали поради, як краще використовувати всі принади майданчику та просувати свій бізнес. З ними вам буде простіше орієнтуватися та створювати послуги для збільшення кількості замовлень. ')

    }

    validateAdvice3() {
        cy.get('#helpTitle-2').contains('Топ-5 видів просування на BONFAIR').click()
        cy.get('#helpDesc-2').contains('Зібрали поради, як краще використовувати всі принади майданчику та просувати свій бізнес. З ними вам буде простіше орієнтуватися та створювати послуги для збільшення кількості замовлень. ')

    }

    clickOnLetsSeeBtn() {
        cy.get('button').contains('Нумо гляньмо!').click()
    }

    assertModalWindow() {
        cy.get('.bonfair_auth_modal-box').should('be.visible');
    }

}

export default MainPage;