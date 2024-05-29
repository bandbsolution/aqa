import PageObject from '../PageObject';

class MainPagePageObject extends PageObject {

    clickOnHeaderLogo() {
         cy.get('.header-logo').click();
    }

    clickOnFooterLogo() {
        cy.get('.footer-logo').click();
    }

    get footerSupport() {
        return cy.get('.footer-address-text');
    }

    validateAdvice1() {
        cy.get('span').contains('Що таке Social Selling і чому тобі варто почати ним користуватись вже зараз?').click()
        //cy.get('.div').find('p').should('have.text','Зібрали поради, як краще використовувати всі принади майданчику та просувати свій бізнес. З ними вам буде простіше орієнтуватися та створювати послуги для збільшення кількості замовлень. ');
    }

    validateAdvice2() {
        cy.get('span').contains('Як користуватися сервісом і отримувати більше прибутку і задоволення?').click()
    }

    validateAdvice3() {
        cy.get('span').contains('Топ-5 видів просування на BONFAIR').click()
    }

    clickOnLetsSeeBtn() {
        cy.get('button').contains('Нумо гляньмо!').click()
    }

    assertModalWindow() {
        cy.get('.bonfair_auth_modal-box').should('be.visible');
    }

}

export default MainPagePageObject;